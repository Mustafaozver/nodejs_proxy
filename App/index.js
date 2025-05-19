((ATA)=>{
	const express = ATA.Require('express');
	const request = ATA.Require('request');
	
	const PROTOCOL = "http";
	const ADDRESS = "127.0.0.1";
	const PORT_INNER = 11434;
	const PORT_OUTER = 5550;
	
	ATA.Setups.push(()=>{
		const app = express();
		
		const target = PROTOCOL + ":" + "//" + ADDRESS + ":" + PORT_INNER;
		
		/*
		app.use((req, res, next) => {
			console.log(`[${req.method}] ${req.url}`);
			next();
		});
		*/
		
		app.use((req, res)=>{
			const url = target + req.url;
			
			const req_ = request({
				url,
				method: req.method,
				headers: req.headers
			});
			
			req
				.pipe(req_)
				.pipe(res);
			
		});
		
		app.listen(PORT_OUTER, ()=>{
			console.log("Proxy sunucusu " + PORT_OUTER + " portunda çalışıyor");
		});
		
	});
})(require("ata.js")());