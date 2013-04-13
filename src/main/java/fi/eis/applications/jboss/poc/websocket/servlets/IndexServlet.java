package fi.eis.applications.jboss.poc.websocket.servlets;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jboss.logging.Logger;

@SuppressWarnings("serial")
@WebServlet("") // In servlets 3.0, empty value means bind to front page and only that
                // "/" would bind to all requests
public class IndexServlet extends HttpServlet {
    private final Logger log = Logger.getLogger(this.getClass());
    
     @Override
    protected void doGet(final HttpServletRequest request,
        final HttpServletResponse response) throws ServletException, IOException {
        String destination = "/WEB-INF/index.jsp";
        
        log.debug("It's us here");

        String socketURL = String.format("%s:%s%s%s",
                                request.getServerName(),
                                request.getServerPort(),
                                request.getContextPath(),
                                MyWebSocketServlet.SOCKET_PATH);
        
        request.setAttribute("socketURL", socketURL);

        RequestDispatcher rd = getServletContext().getRequestDispatcher(destination);
        rd.forward(request, response);        
    }    
}
