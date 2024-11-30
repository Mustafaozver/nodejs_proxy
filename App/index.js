((ATA)=>{
	const http = ATA.Require("http");
	const httpProxy = ATA.Require("http-proxy");
	
	
	ATA.Setups.push(()=>{
		const proxy = httpProxy.createProxyServer({
			target: "http" + "://127.0.0.1:11434",
			changeOrigin: true 
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
		
		const PORT = 5550;
		server.listen(PORT, ()=>{
			console.log(`Proxy sunucusu ${PORT} portunda çalışıyor. Tüm istekler localhost:11434 adresine yönlendiriliyor.`);
		});
	});
})(require("ata.js")());


