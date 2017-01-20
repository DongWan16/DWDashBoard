import express from 'express';
import path from 'path';

import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';

const app = express();
const port = 3000;
const devPort = 9999;

app.use('/', express.static(path.join(__dirname, './../public')));

app.get('/hello', (req, res) => {
    return res.send('Hello React Dev Environment');
});

app.listen(port, () => {
    console.log('Express is listening on port', port);
});

if(process.env.NODE_ENV == 'development') {
    console.log('Server is running on development mode');
    const config = require('../webpack.dev.config');
    const compiler = webpack(config);
    const devServer = new WebpackDevServer(compiler, config.devServer);
    devServer.listen(
        devPort, () => {
            console.log('webpack-dev-server is listening on port', devPort);
        }
    );
}