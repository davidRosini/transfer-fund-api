import axios from "axios";
import debug from "debug";
import envs from "../config/config.env";

import { AccountTransferbalanceDto } from "../dtos/account.transfer.balance.dto";

const log: debug.IDebugger = debug("app:account-dao");

class AccountDao {
  async postAccountApi(dto: AccountTransferbalanceDto) {
    log("POST account API...");
    try {
      await axios({
        url: envs.accountApiUrl,
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: {
          accountNumber: dto.accountNumber,
          value: dto.value,
          type: dto.type,
        },
      });
    } catch (err: any) {
      log("ERROR POST account API \n" + err);
      if (err.response) {
        if (err.response.status == 400) {
          throw new Error("Fields in accounts API request invalid");
        }

        if (err.response.status == 404) {
          throw new Error("Invalid account number");
        }

        if (err.response.status >= 400) {
          throw new Error("Accounts API server error");
        }
      }
      if (err.request) {
        throw new Error("Error request to accounts API");
      }
      throw new Error("Fatal error calling accounts API: " + err.message);
    }
  }

  async getAccount(accountNumber: string) {
    log("GET account API...");
    return await axios.get(envs.accountApiUrl + "/" + accountNumber);
  }
}

export default new AccountDao();
