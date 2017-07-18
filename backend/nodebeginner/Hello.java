import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.concurrent.Executors;

/**
[root@host-10-200-131-8 ~]# wrk -c50 -t10 http://10.200.5.86:8080/server
Running 10s test @ http://10.200.5.86:8080/server
  10 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    40.62ms    1.19ms  63.67ms   97.70%
    Req/Sec   123.35     15.35   151.00     60.64%
  12361 requests in 10.10s, 2.15MB read
Requests/sec:   1223.86
Transfer/sec:    218.05KB
*/

//jdk自带轻量级http server例子  http://127.0.0.1:8080/server
public class Hello {
    public static void main(String[] args) throws IOException {
        InetSocketAddress addr = new InetSocketAddress(8080);
        HttpServer server = HttpServer.create(addr, 0);

        server.createContext("/server", new MyHandler());
        server.setExecutor(Executors.newCachedThreadPool());
        server.start();
        System.out.println("Server is listening on port 8080");
    }
}

class MyHandler implements HttpHandler {
    public void handle(HttpExchange exchange) throws IOException {
        String requestMethod = exchange.getRequestMethod();
        if (requestMethod.equalsIgnoreCase("GET")) {
            Headers responseHeaders = exchange.getResponseHeaders();
            responseHeaders.set("Content-Type", "text/plain");
            // responseHeaders.set("Content-Type", "text/html; charset=utf-8");
            exchange.sendResponseHeaders(200, 0);

            OutputStream responseBody = exchange.getResponseBody();
            Headers requestHeaders = exchange.getRequestHeaders();
            Set<String> keySet = requestHeaders.keySet();
            Iterator<String> iter = keySet.iterator();
            while (iter.hasNext()) {
                String key = iter.next();
                List values = requestHeaders.get(key);
                String s = key + " = " + values.toString() + "\n";
                responseBody.write(s.getBytes());
            }
            responseBody.write("jdk自带轻量级http server例子".getBytes());
            responseBody.close();
        }
    }
}
