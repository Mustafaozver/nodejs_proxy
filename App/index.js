((ATA)=>{
	const http = ATA.Require("http");
	const httpProxy = ATA.Require("http-proxy");
	const { createProxyMiddleware } = require('http-proxy-middleware');
	const express = require('express');
	const request = require('request');
	
	
	ATA.Setups.push(()=>{
		
		
		const app = express();

		const target = 'http://127.0.0.1:11434'; // Ollama varsayılan port

		// Tüm istekleri önce loglayalım (opsiyonel)
		app.use((req, res, next) => {
			console.log(`[${req.method}] ${req.url}`);
			next();
		});

		// Örnek özel endpoint: elle yönlendir (request modülü ile)
		app.use('/', (req, res) => {
			const url = `${target}${req.url.replace(/^\/custom/, '')}`;
			console.log('Custom proxying to:', url);

			req.pipe(request({ url, method: req.method, headers: req.headers }))
				.on('error', err => {
					console.error('Proxy error:', err);
					res.status(500).send('Proxy error');
				})
				.pipe(res);
		});
		
		
		app.listen(5550, () => {
			console.log('Proxy sunucusu 8080 portunda çalışıyor');
		});
		
	});

	
	
	
	ATA.Setups.push(()=>{
	return;
		//const http = require('http');

		const server = http.createServer(async (req, res) => {
			return;
			const url = `http://127.0.0.1:11434${req.url}`;

			try {
				const upstreamRes = await fetch(url, {
					method: req.method,
					headers: req.headers
				});

				res.writeHead(upstreamRes.status, Object.fromEntries(upstreamRes.headers.entries()));
				upstreamRes.body.pipe(res);
			} catch (err) {
				res.writeHead(500);
				res.end('Proxy error: ' + err.message);
			}
		});

		server.listen(8080, () => {
			console.log('Manuel proxy 8080 portunda çalışıyor');
		});

	
	});
	
	
	
	
	
	ATA.Setups.push(()=>{
		return;
		const app = express();

		app.use('/', createProxyMiddleware({
			target: 'https://www.google.com',
			changeOrigin: true,
			//ws: true, // WebSocket destekliyorsa ekle
			//logLevel: 'debug' // sorunları görmek için
		}));

		app.listen(8080, () => {
			console.log('Proxy sunucusu 8080 portunda çalışıyor');
		});
	});
	
	ATA.Setups.push(()=>{
		return;
		const PORT = 80;
		const PROXY = true;
		
		const target = "https://www.google.com/";
		const forward = target;
		
		const proxy = httpProxy.createProxyServer({
			//target,
			//forward,
			//changeOrigin: true,
			//secure: false,
			//ws: true,
		});
		
		const server = http.createServer((req, res)=>{
			console.log("istek geldi", req.method
			, req.url, {
				
			});
			
			if(PROXY)proxy.web(req, res,  {
				target,
				forward,
				//changeOrigin: true,
				//selfHandleResponse: false,
			}, (error)=>{
				console.log("ok");
				console.log(obj);
				console.error("Proxy sırasında hata oluştu:", error);
				res.writeHead(500, {
					"Content-Type": "text/plain"
				});
				res.end("Bir hata oluştu.");
			});
			else{
				res.writeHead(200, { 'Content-Type': 'text/plain' });
				res.end('Merhaba, hedef sunucudan yanıt geldi!\n');
			}
			
		});
		
		proxy.on('proxyReq', (proxyRes, req, res) => {
			console.log(`✅ Proxy hedeften istek aldı: ${proxyRes.statusCode}`);
		});
		
		proxy.on('proxyRes', (proxyRes, req, res) => {
			console.log(`✅ Proxy hedeften cevap aldı: ${proxyRes.statusCode}`);
		});
		
		proxy.on('error', (err) => {
			console.log(err);
		});
		
		
		
		server.listen(PORT, "0.0.0.0", ()=>{
			console.log("Proxy [" + PORT + "] başlatıldı.");
		});
	});
})(require("ata.js")());