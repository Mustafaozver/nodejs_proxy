((ATA)=>{
	const Express = ATA.Require("express");
	const Request = ATA.Require("request");
	
	const PROTOCOL = "http";
	const ADDRESS = "127.0.0.1";
	const PORT_INNER = 11434;
	const PORT_OUTER = 5550;
	const PATH_INNER = "";
	const PATH_OUTER = "";
	
	ATA.Setups.push(()=>{
		const app = Express();
		
		const target = PROTOCOL + ":" + "//" + ADDRESS + ":" + PORT_INNER + PATH_INNER;
		
		app.use("/" + PATH_OUTER, (req_, res_)=>{
			const url = target + req_.url;
			
			const request = Request({
				url,
				method: req_.method,
				headers: {
					"X-Forwarded-For": req_.ip,
					...req_.headers
				}
			});
			
			req_
				.pipe(request)
				// middlewares
				.pipe(res_);
			
		});
		
		app.listen(PORT_OUTER, ()=>{
			console.log("Proxy sunucusu " + PORT_OUTER + " portunda çalışıyor");
		});
		
	});
})(require("ata.js")());