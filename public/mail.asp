<%
Set myMail = CreateObject("CDO.Message")
myMail.Subject = Request.Form("title")
myMail.From = "chcwcup@mail.ncku.edu.tw"
myMail.To = "yl931905@gmail.com"
myMail.CreateMHTMLBody = "http://stud.adm.ncku.edu.tw/act/chcwcup/register/?th=11&university=ncku&sport=-Kfvb5YCBPyMLRWOk-zt"
myMail.Send
set myMail = nothing
%>
