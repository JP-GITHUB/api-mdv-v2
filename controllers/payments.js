'use strict'
const khipu = require('fi-khipu');
const ctr_sale = require('../controllers/sales');
const config_app = require('../config/config_app');

khipu.configure(config_app.app.credentials.KHIPU_COLABORATOR_ID, config_app.app.credentials.KHIPU_KEY);
khipu.config.sslVerification = false;

exports.banks = async function (data) {
    return new Promise((resolve, reject) => {
        khipu.listBanks(function callback(err, banks) {
            if (err) {
                throw err;
            }

            resolve({ status: true, obj: banks });
        });
    })
}

exports.generate = async function (subject, amount) {
    var payment = {
        subject: subject,
        amount: amount
    };

    return new Promise((resolve, reject) => {
        khipu.createPayment(payment, function callback(err, payment) {
            if (err) {
                resolve({ status: false, msg: err.message });
                return;
            }

            console.log(payment);

            resolve({ status: true, obj: payment });
        });
    });
}

exports.confirm_sale_with_token = async function (obj) {
    return new Promise((resolve, reject) => {

        let tmpData = {
            "payment_id": 'hksgeq9g3w5j'
        };

        if (ctr_sale.confirm_sale(tmpData)) {
            resolve({ status: true });
        } else {
            resolve({ status: false });
        }

        return;

        if (!obj.notification_token) {
            resolve({ status: false, msg: 'Sin token de notificación' });
        }

        khipu.getPaymentByNotificationToken(obj.notification_token, function (err, payment) {
            if (err) {
                //throw err;
                console.log(err);
                resolve({ status: false});
            }

            if (payment.status == "done") {
                let tmpData = {
                    "payment_id": payment.payment_id,
                    "payment_url": payment.payment_url,
                    "receiver_id": payment.receiver_id,
                    "notification_token": payment.notification_token,
                    "amount": payment.amount,
                    "conciliation_date": payment.conciliation_date
                };

                if (ctr_sale.confirm_sale(tmpData)) {
                    resolve({ status: true });
                } else {
                    resolve({ status: false });
                }
            } else {
                resolve({ status: false, msg: 'Venta: aun no se encuentra pagada.' });
            }
        });
    });
}