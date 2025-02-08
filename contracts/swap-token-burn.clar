


;;  (impl-trait 'STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV.stackswap-swap.stackswap-swap)
 
 (use-trait sip-010-token .sip-010-trait-ft-standard.sip-010-trait)

(define-constant contract-owner 'STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV)
(define-constant fee-percent u30) ;; 0.3%
(define-constant burn-percent u5) ;; 0.5%

(define-constant invalid-amount-err (err u66))
(define-constant not-owner-err (err u63))
(define-constant invalid-pair-err (err u65))
(define-constant pair-already-exists-err (err u69))
(define-constant too-much-slippage-err (err u71))
(define-constant transfer-x-failed-err (err u72))
(define-constant transfer-y-failed-err (err u73))
(define-constant pair-not-found-err (err u1001))
;; (define-constant value-out-of-range-err (err u74))


;; Burn address for Stone tokens
(define-constant burn-address 'STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV)

;; Hardcoded Stone token principal
(define-constant stone-token 'STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV.stone-token)

(define-map pairs-map
  { pair-id: uint }
  {
    token-x: principal,
    token-y: principal,
  }
)

(define-map pairs-data-map
  {
    token-x: principal,
    token-y: principal,
  }
  {
    shares-total: uint,
    balance-x: uint,
    balance-y: uint,
    fee-balance-x: uint,
    fee-balance-y: uint,
    fee-to-address: (optional principal),
    name: (string-ascii 32),
  }
)

(define-data-var pair-count uint u0)

(define-public (create-pair (token-x-trait <sip-010-token>) (token-y-trait <sip-010-token>) (pair-name (string-ascii 32)) (x uint) (y uint))
  (begin 
  ;; (asserts! (is-principal token-x-trait) (err u100)) ;; Error u100: Invalid token-x
  ;; (asserts! (is-principal token-y-trait) (err u101)) ;; Error u101: Invalid token-y
   (asserts! (not (is-eq token-x-trait token-y-trait)) (err u102)) ;; Error u102: Tokens cannot be identical

  ;; Ensure only the contract owner can create a pair
    (asserts! (is-eq tx-sender contract-owner) not-owner-err)
    ;; Ensure x and y are greater than 0
    (asserts! (> x u0) (err u101)) ;; Error u101: x must be greater than 0
    (asserts! (> y u0) (err u102)) ;; Error u102: y must be greater than 0
     (let
    (
      (token-x (contract-of token-x-trait))
      (token-y (contract-of token-y-trait))
      (pair-id (+ (var-get pair-count) u1))
      (pair-data {
        shares-total: u0,
        balance-x: u0,
        balance-y: u0,
        fee-balance-x: u0,
        fee-balance-y: u0,
        fee-to-address: none,
        name: pair-name,
      })
    )
    (asserts!
      (and
        (is-none (map-get? pairs-data-map { token-x: token-x, token-y: token-y }))
        (is-none (map-get? pairs-data-map { token-x: token-y, token-y: token-x }))
      )
      pair-already-exists-err
    )

    (map-set pairs-data-map { token-x: token-x, token-y: token-y } pair-data)
    (map-set pairs-map { pair-id: pair-id } { token-x: token-x, token-y: token-y })
    (var-set pair-count pair-id)
    (ok true)
  )
  )
 
)

(define-public (add-to-position (token-x-trait <sip-010-token>) (token-y-trait <sip-010-token>) (x uint) (y uint))
  (begin
    ;; Restriction: Only contract-owner can call this function
    (asserts! (is-eq tx-sender contract-owner) not-owner-err)
    
    ;; Validate inputs
    (asserts! (> x u0) invalid-amount-err)
    (asserts! (> y u0) invalid-amount-err)

    (let
    (
      ;;contract-of function to get the contract addresses of the token traits
      (token-x (contract-of token-x-trait))
      (token-y (contract-of token-y-trait))
       (pair (unwrap! (map-get? pairs-data-map { token-x: token-x, token-y: token-y }) pair-not-found-err))
      (balance-x (get balance-x pair))
      (balance-y (get balance-y pair))
      (new-shares (if (is-eq (get shares-total pair) u0)
                     (sqrti (* x y))
                     (/ (* x (get shares-total pair)) balance-x)))
      (new-y (if (is-eq (get shares-total pair) u0)
                y
                (/ (* x balance-y) balance-x)))
      (pair-updated (merge pair {
        shares-total: (+ new-shares (get shares-total pair)),
        balance-x: (+ balance-x x),
        balance-y: (+ balance-y new-y)
      }))
    )
    (asserts! (is-ok (contract-call? token-x-trait transfer x tx-sender (as-contract tx-sender)  none)) transfer-x-failed-err)
    (asserts! (is-ok (contract-call? token-y-trait transfer new-y tx-sender (as-contract tx-sender) none)) transfer-y-failed-err)
    (map-set pairs-data-map { token-x: token-x, token-y: token-y } pair-updated)
    (ok true)
  )
  )
  
)

(define-public (swap-x-for-y (token-x-trait <sip-010-token>) (token-y-trait <sip-010-token>) (dx uint) (min-dy uint))
  (let
    (
      (token-x (contract-of token-x-trait))
      (token-y (contract-of token-y-trait))
      (pair (unwrap! (map-get? pairs-data-map { token-x: token-x, token-y: token-y }) invalid-pair-err))
      (balance-x (get balance-x pair))
      (balance-y (get balance-y pair))
      (fee (/ (* fee-percent dx) u10000)) ;; 0.3% fee
      (burn (/ (* burn-percent dx) u10000)) ;; 0.5% burn amount
      (dy (/ (* balance-y (- dx fee)) (+ balance-x dx)))
      (pair-updated (merge pair
        {
          balance-x: (+ balance-x dx),
          balance-y: (- balance-y dy),
          fee-balance-x: (+ fee (get fee-balance-x pair))
        }))
    )
    ;; Ensure minimum output is met
    (asserts! (< min-dy dy) too-much-slippage-err)

    ;; Transfer X tokens from the user to contract
    (asserts! (is-ok (contract-call? token-x-trait transfer dx tx-sender (as-contract tx-sender) none)) transfer-x-failed-err)

    ;; Transfer Y tokens to the user
    (asserts! (is-ok (contract-call? token-y-trait transfer dy (as-contract tx-sender) tx-sender none)) transfer-y-failed-err)

    ;; Burn the Stone token
    (asserts! (is-ok (contract-call? .stone-token transfer burn tx-sender burn-address none)) (err u999))

    ;; Update the pair data
    (map-set pairs-data-map { token-x: token-x, token-y: token-y } pair-updated)
    (ok dy)
  )
)

(define-public (swap-y-for-x (token-x-trait <sip-010-token>) (token-y-trait <sip-010-token>) (dy uint) (min-dx uint))
  (let
    (
      (token-x (contract-of token-x-trait))
      (token-y (contract-of token-y-trait))
      (pair (unwrap! (map-get? pairs-data-map { token-x: token-x, token-y: token-y }) invalid-pair-err))
      (balance-x (get balance-x pair))
      (balance-y (get balance-y pair))
      (fee (/ (* fee-percent dy) u10000)) ;; 0.3% fee
      (burn (/ (* burn-percent dy) u10000)) ;; 0.5% burn amount
      (dx (/ (* balance-x (- dy fee)) (+ balance-y dy)))
      (pair-updated (merge pair
        {
          balance-x: (- balance-x dx),
          balance-y: (+ balance-y dy),
          fee-balance-y: (+ fee (get fee-balance-y pair))
        }))
    )
    ;; Ensure minimum output is met
    (asserts! (< min-dx dx) too-much-slippage-err)

    ;; Transfer Y tokens from the user
    (asserts! (is-ok (contract-call? token-y-trait transfer dy tx-sender (as-contract tx-sender) none)) transfer-y-failed-err)

    ;; Transfer X tokens to the user
    (asserts! (is-ok (contract-call? token-x-trait transfer dx (as-contract tx-sender) tx-sender none)) transfer-x-failed-err)

    ;; Burn the Stone token
    (asserts! (is-ok (contract-call? .stone-token transfer burn tx-sender burn-address none)) (err u999))

    ;; Update the pair data
    (map-set pairs-data-map { token-x: token-x, token-y: token-y } pair-updated)
    (ok dx)
  )
)

