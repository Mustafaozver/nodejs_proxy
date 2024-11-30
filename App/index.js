((ATA)=>{
	const http = ATA.Require("http");
	const httpProxy = ATA.Require("http-proxy");
	
	
	ATA.Setups.push(()=>{
		const PORT = 5550;
		
		const proxy = httpProxy.createProxyServer({
			target: "http://127.0.0.1:11434",
			changeOrigin: true,
			//secure: false,
			ws: true,
		});
		
		const server = http.createServer((req, res)=>{
			proxy.web(req, res, (error)=>{
				console.error("Proxy sırasında hata oluştu:", error);
				res.writeHead(500, {
					"Content-Type": "text/plain"
				});
				res.end("Bir hata oluştu.");
			});
		});
		
		server.listen(PORT, ()=>{
			console.log("Proxy [" + PORT + "] başlatıldı.");
		});
	});
})(require("ata.js")());