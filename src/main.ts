import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as admin from 'firebase-admin';
import {ValidationPipe} from '@nestjs/common';


admin.initializeApp({
    credential: admin.credential.cert({
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            type: process.env.type,
            // eslint-disable-next-line @typescript-eslint/camelcase
            project_id: process.env.project_id,
            // eslint-disable-next-line @typescript-eslint/camelcase
            private_key_id: process.env.private_key_id,
            // eslint-disable-next-line @typescript-eslint/camelcase
            // private_key: process.env.private_key,
            // eslint-disable-next-line @typescript-eslint/camelcase
            private_key:  JSON.parse(process.env.private_key),
            // eslint-disable-next-line @typescript-eslint/camelcase
            client_email: process.env.client_email,
            // eslint-disable-next-line @typescript-eslint/camelcase
            client_id: process.env.client_id,
            // eslint-disable-next-line @typescript-eslint/camelcase
            auth_uri: 'https://accounts.google.com/o/oauth2/auth',
            // eslint-disable-next-line @typescript-eslint/camelcase
            token_uri: 'https://accounts.google.com/o/oauth2/token',
            // eslint-disable-next-line @typescript-eslint/camelcase
            auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
            // eslint-disable-next-line @typescript-eslint/camelcase
            client_x509_cert_url: process.env.client_x509_cert_url,
        },
    ),
    databaseURL: process.env.firebase_databaseURL
});
const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Pragma, Expires, Cache-Control, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' === req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
};

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.use(allowCrossDomain);
    await app.listen(process.env.PORT || 3000)

}

bootstrap();
