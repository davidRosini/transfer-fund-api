import AccountDao from "../daos/account.dao";

import { AccountTransferbalanceDto } from "../dtos/account.transfer.balance.dto";

class AccountService {
  async transferBalance(dto: AccountTransferbalanceDto) {
    await AccountDao.postAccountApi(dto);
  }

  async findAccount(accountNumber: string) {
    return await AccountDao.getAccount(accountNumber);
  }
}

export default new AccountService();
