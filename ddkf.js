.filter((item: any) => {
          if (transferType === "all") return true;
          if (transferType === "single") {
            return item.transactionType.TransactionType === "Telegraphic Transfer" || 
                   item.transactionType.TransactionType === "Within Bank Transfer";
          }
          if (transferType === "file-upload") {
            return item.transactionType.TransactionType === "File Upload";
          }
          return false;
        })
