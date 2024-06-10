export type ITransaction = {
  walletId: string
  userId?: string
  amount: number
  type: string
  description: string
  status?: string
  paymentTransactionId: string
  meta: {
    senderId?: string
    purpose?: string
    recipientId?: string
    transaction_id?: string | number
  }
  _id: string
  createdAt: string
  updatedAt: string
}

export type IPayment = {
  _id: string
  userId: {
    _id: string
    username: string
  }
  amount: number
  status: string
  meta: {
    Type: string
    from: string
    to: string
    currency: string
    detail?: {
      accountName: string
      bankName: string
      accountNumber: number
    }
    typeName?: string
    id?: string
    typeNpame?: string
  }
  paymentId: string
  createdAt: string
  updatedAt: string
}

export type IWallet = {
  balance: number
  currency: string
}

export type IFund = {
  amount: number
  transactionId: string
  paymentProvider: string
}
