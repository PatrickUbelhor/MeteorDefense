package main;

import com.google.appengine.api.utils.SystemProperty;

import java.io.IOException;
import java.util.Properties;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

// With @WebServlet annotation the webapp/WEB-INF/web.xml is no longer required.
@WebServlet(name = "HelloAppEngine", value = "/hello")
public class HelloAppEngine extends HttpServlet {
	
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		Properties properties = System.getProperties();
		
		response.setContentType("text/plain");
//		response.getWriter().println("Hello App Engine - Standard using "
//		                             + SystemProperty.version.get() + " Java "
//		                             + properties.get("java.specification.version"));
		
		response.getWriter().println("Hello, World!");
	}
	
	public static String getInfo() {
		return "Version: " + System.getProperty("java.version")
		       + " OS: " + System.getProperty("os.name")
		       + " User: " + System.getProperty("user.name");
	}
	
}