var config = require("../Utils/dbconfig");
const sql = require("mssql");



//ws_loadPayment
//////////////////////////////////////////////////////////////////////////////////////////////////////
async function ws_loadPayment(findRequest) {
  try {
    let pool = await sql.connect(config);
    let getPayment;

    //show all records

    if (
      ( findRequest.CashAssistanceDetailId === undefined &&
        findRequest.PaymentGatewayId === undefined &&
        findRequest.PaymentDate === undefined &&
        findRequest.PaymentStatus === undefined &&
        findRequest.CharityAccountId === undefined &&
        findRequest.FollowCode === undefined &&
        findRequest.NeedyId === undefined &&
        findRequest.PaymentId === undefined ) ||
        (findRequest.CashAssistanceDetailId === null &&
         findRequest.PaymentGatewayId === null &&
         findRequest.PaymentDate === null &&
         findRequest.PaymentStatus === null &&
         findRequest.CharityAccountId === null &&
         findRequest.FollowCode === null &&
         findRequest.NeedyId === null &&
         findRequest.PaymentId === null )
    ) {
        getPayment = await pool.request().query(`SELECT tblPayment.*
            FROM tblPayment 
            join tblCashAssistanceDetail 
            on tblPayment.CashAssistanceDetailId = tblCashAssistanceDetail.CashAssistanceDetailId
            join tblPlans
            on tblCashAssistanceDetail.PlanId = tblPlans.PlanId
            join tblPersonal 
            on tblPayment.NeedyId = tblPersonal.PersonId
            left join tblCharityAccounts 
            on tblPayment.CharityAccountId = tblCharityAccounts.CharityAccountId
            `);
            
      return getPayment.recordsets[0];
    } else {
      //create  whereclause
      let whereclause = "";
      for (x in findRequest) {
        if (typeof findRequest[String(x)] == "string") {
          whereclause =
            whereclause +
            " " +
            `tblPayment.${x} = N` +
            "'" +
            findRequest[String(x)] +
            "'" +
            ` AND`;
        } else if (typeof findRequest[String(x)] == "number") {
          whereclause =
            whereclause + " " + `tblPayment.${x} =  ${findRequest[String(x)]}` + ` AND`;
        } else if (findRequest[String(x)] == null) {
          whereclause =
            whereclause + " " + `tblPayment.${x} is null` + ` AND`;
        }
      }

      whereclause = await whereclause.slice(0, -3);
   console.log(whereclause);
      //show records with whereclause

      getPayment = await pool
        .request()
        .query(`SELECT tblPayment.*
        FROM tblPayment 
        join tblCashAssistanceDetail 
        on tblPayment.CashAssistanceDetailId = tblCashAssistanceDetail.CashAssistanceDetailId
        join tblPlans
        on tblCashAssistanceDetail.PlanId = tblPlans.PlanId
        join tblPersonal 
        on tblPayment.NeedyId = tblPersonal.PersonId
        left join tblCharityAccounts 
        on tblPayment.CharityAccountId = tblCharityAccounts.CharityAccountId
         where` + whereclause);
      return getPayment.recordsets[0];
    }
  } catch (error) {
    console.log(error.message);
  }
}

//ws_loadCashAssistanceDetail
//////////////////////////////////////////////////////////////////////////////////////////////////////
async function ws_loadCashAssistanceDetail(findRequest) {
    try {
      let pool = await sql.connect(config);
      let CashAssistanceDetail;
  
      //show all records
  
      if (
        ( findRequest.AssignNeedyPlanId === undefined &&
          findRequest.PlanId === undefined &&
          findRequest.CashAssistanceDetailId === undefined
          ) ||
          (findRequest.AssignNeedyPlanId === null &&
            findRequest.PlanId === null &&
            findRequest.CashAssistanceDetailId === null )
      ) {
          CashAssistanceDetail = await pool.request().query(`SELECT tblCashAssistanceDetail.*
          FROM tblCashAssistanceDetail   
         inner join tblAssignNeedyToPlans
         on tblCashAssistanceDetail.PlanId = tblAssignNeedyToPlans.PlanId
         and tblCashAssistanceDetail.AssignNeedyPlanId = tblAssignNeedyToPlans.AssignNeedyPlanId
         inner join tblPlans
         on tblAssignNeedyToPlans.PlanId = tblPlans.PlanId
         inner join tblPersonal
         on tblAssignNeedyToPlans.NeedyId = tblPersonal.PersonId
               `);
        return CashAssistanceDetail.recordsets[0];
      } else {
        //create  whereclause
        let whereclause = "";
        for (x in findRequest) {
          if (typeof findRequest[String(x)] == "string") {
            whereclause =
              whereclause +
              " " +
              `tblCashAssistanceDetail.${x} = N` +
              "'" +
              findRequest[String(x)] +
              "'" +
              ` AND`;
          } else if (typeof findRequest[String(x)] == "number") {
            whereclause =
              whereclause + " " + `tblCashAssistanceDetail.${x} =  ${findRequest[String(x)]}` + ` AND`;
          } else if (findRequest[String(x)] == null) {
            whereclause =
              whereclause + " " + `tblCashAssistanceDetail.${x} is null` + ` AND`;
          }
        }
  
        whereclause = await whereclause.slice(0, -3);
      
        //show records with whereclause
  
        CashAssistanceDetail = await pool
          .request()
          .query(`SELECT tblCashAssistanceDetail.*
          FROM tblCashAssistanceDetail   
         inner join tblAssignNeedyToPlans
         on tblCashAssistanceDetail.PlanId = tblAssignNeedyToPlans.PlanId
         and tblCashAssistanceDetail.AssignNeedyPlanId = tblAssignNeedyToPlans.AssignNeedyPlanId
         inner join tblPlans
         on tblAssignNeedyToPlans.PlanId = tblPlans.PlanId
         inner join tblPersonal
         on tblAssignNeedyToPlans.NeedyId = tblPersonal.PersonId  where` + whereclause);
        return CashAssistanceDetail.recordsets[0];
      }
    } catch (error) {
      console.log(error.message);
    }
  }
//ws_Payment
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function ws_Payment(findRequest) {
  try {
    let pool = await sql.connect(config);

    let value = "";

    for (x in findRequest) {
      if (
        findRequest[String(x)] == null ||   typeof findRequest[String(x)] == "number") {
        value = value + " " + `${findRequest[String(x)]}` + `,`;
      } else {
        value = value + " " + `N`+ "'" + findRequest[String(x)] + "'" + `,`;
      }
    }

    value = await value.slice(0, -1);
  
    let insertTblPayment = await pool.request().query(
      `INSERT INTO tblPayment  (DonatorId,CashAssistanceDetailId,PaymentPrice,PaymentGatewayId,PaymentDate,PaymentTime,PaymentStatus,SourceAccoutNumber,TargetAccountNumber,CharityAccountId,FollowCode,NeedyId)
            VALUES (` +
        value +
        `)`
    );

    
    let getPayment = await pool.request().query(`SELECT top 1 * FROM tblPayment ORDER By PaymentId DESC`)
    
    return getPayment.recordsets[0][0].PaymentId;
  } catch (error) {
    console.log(error.message);
  }
}
//Payment Price Sum
/////////////////////////////////////////////////////////////////////////////////////////////////////////
async function paymentPriceSum(findRequest) {
  let pool = await sql.connect(config);
  let whereclause = "";
  for (x in findRequest) {
    if (typeof findRequest[String(x)] == "string") {
      whereclause =
        whereclause +
        " " +
        `${x} = N` +
        "'" +
        findRequest[String(x)] +
        "'" +
        ` AND`;
    } else if (typeof findRequest[String(x)] == "number") {
      whereclause =
        whereclause + " " + `${x} =  ${findRequest[String(x)]}` + ` AND`;
    } else if (findRequest[String(x)] == null) {
      whereclause =
        whereclause + " " + `${x} is null` + ` AND`;
    }
  }

  whereclause = await whereclause.slice(0, -3);


  let A = await pool.request().query(`SELECT SUM(paymentPrice) as totalPaymentPrice
  FROM tblPayment
  WHERE `+ whereclause)
  return A.recordsets[0][0].totalPaymentPrice
}

module.exports = {
  ws_loadPayment : ws_loadPayment,
  ws_loadCashAssistanceDetail : ws_loadCashAssistanceDetail,
  ws_Payment : ws_Payment,
  paymentPriceSum : paymentPriceSum
};