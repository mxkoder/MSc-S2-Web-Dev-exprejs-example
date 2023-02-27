$(function()
{
    $.ajaxSetup({cache: false});
    $("#read-button").click(ReadStudentsClick);

});

function ReadStudentsClick(e) 
{
    $.ajax({
        cache: false,
        type: "GET",
        url: 'http://localhost:1339/students',
        data: '',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: ReadAllResults,
        error: (req, status, error) => console.log("Failed to add students")
    });

    e.preventDefault();
    return false;
}

function ReadAllResults(json, status, req) 
{
    let html="";
    for(let s in json)
    {
        let student=json[s];
        html += `Id: ${student.Id} Name: ${student.Name}`;
        html += `Age: ${student.Age} Course: ${student.Course}<br/>`;
    }
    $("#all-students").html(html);
}