const express = require("express")
const app = express()
require('dotenv').config()

const authRouter = require('./src/routes/auth')
const registerRouter = require('./src/routes/register')
const adminDashboardRouter = require('./src/routes/admin-dashboard')

// const swaggerUi = require('swagger-ui-express')
// const swaggerFile = require('./swagger_output.json')
// app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))


app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use("/api/auth",authRouter)
app.use("/api/register",registerRouter)


app.use("/api/dashboard",adminDashboardRouter)





app.use(require('body-parser').urlencoded({ extended: true }));
app.use((err, req, res, next) => {
    // This check makes sure this is a JSON parsing issue, but it might be
    // coming from any middleware, not just body-parser:
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        //console.error(err);
        return res.sendStatus(400); // Bad request
    }

    if (err.type === 'entity.parse.failed') {
        // Your custom error handler here
        res.status(500).send('The client sent invalid JSON');
      }

    next();
});

// Remove the X-Powered-By headers.
app.set('x-powered-by', false)

app.listen(process.env.PORT || 3000, () => console.log( 'Server is up and running :) :) '))
