const MongoDB = require("./mongodb.service")
const {mongoConfig, tokenSecrect} = require("../config")
const { route } = require("../routes")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { query } = require("express")


const getInvoice = async (invoice) => {
    try {
                  console.log('hihi')
        let invoiceObject = {
          receiver: invoice?.receiver,
          phone: invoice?.phone,
          place: invoice?.place,
          cardnumber: invoice?.cardnumber,
          total: invoice?.total,
          quantity: invoice?.quantity,
        }
        console.log('hihi  '+invoice?.receiver,invoice?.phone,invoice?.place, invoice?.cardnumber, invoice?.total, invoice?.quantity)
        let savedInvoice = await MongoDB.db
        .collection(mongoConfig.collections.INVOICE)
        .insertOne(invoiceObject);
        if (savedInvoice?.acknowledged && savedInvoice?.insertedId){
            let token = jwt.sign({receiver: invoiceObject?.receiver,phone: invoiceObject?.phone, place: invoiceObject?.place, cardnumber: invoiceObject?.cardnumber, total: invoiceObject?.total, quantity: invoiceObject?.quantity }, 
             tokenSecrect, 
             {expiresIn: "24h"} )
             return {
                 status: true,
                 message: "Creat Invoice successfully",
                 data: token,
               };
             } else {
               return {
                 status: false,
                 message: "Create Invoice failed",
                
               };
         }
        
    } catch (error) {
        console.log(error);
       let errorMessage = "Create invoice faile";
       
        return{
            status : false,
            message : errorMessage,
            error : error?.toString(),
        }
    }
};

module.exports = { getInvoice };