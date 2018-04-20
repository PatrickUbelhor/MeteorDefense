package main;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author Patrick Ubelhor
 * @version 04/19/18
 */
public class Hello extends HttpServlet {
	
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		response.setContentType("text/plain");
		response.getWriter().println("Hello, World!");
	}
	
	
	private String get404() {
		return "Error 404 oh nooooooooo";
	}
	
	
	private String get500() {
		return "Error 500...";
	}
	
}