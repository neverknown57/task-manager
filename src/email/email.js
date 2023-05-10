
const sgMail = require('@sendgrid/mail')
// const proxy = require("node-global-proxy").default;

// proxy.setConfig({
//     http: "http://10.7.0.1:8080",
//     https: "http://10.7.0.1:8080"

// });
// proxy.start();


sgMail.setApiKey(process.env.MAIL_API_KEY);



const signup = async (email, name) => {
    const message = {
        from: 'saurabh752001@rediffmail.com',
        to: email,
        subject: 'Thanks for signing up',
        text: `Hellow ${name}, welcome in spam folder`,
        html: `<h3> ${name} welcome bro</h3>`
    }
    try {
        const res = await sgMail.send(message)
        console.log(res)
    }
    catch (err) {
        console.log(err)
        throw new Error(e)
    }
}

const deleteAccount = async (email, name) => {
    const message = {
        from: 'saurabh752001@rediffmail.com',
        to: email,
        subject: 'Sorry!! to leave you',
        text: `Hellow ${name} , So you have tested my backend🙏 \n Khatam Bye Bye Ta-ta Goodbye Gaya`,
        // html: `<bold>Good bye, tata khatm, Gaya</bold>`
    }
    try {
        const res = await sgMail.send(message)
        console.log(res)
    }
    catch (err) {
        console.log(err)
        throw new Error(e)
    }
}

module.exports = {
    signup: signup,
    deleteAccount: deleteAccount
}