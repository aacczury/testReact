<% @codepage=65001 %>
    <%
Set myMail = CreateObject("CDO.Message")
myMail.Subject = Request.Form("title")
myMail.From = "chcwcup@mail.ncku.edu.tw"
myMail.To = Request.Form("email")
myMail.HTMLBody = Request.Form("body")
myMail.Send
set myMail = nothing
%>