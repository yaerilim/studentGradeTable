$(document).ready(sgtReady);

var student_array = [];

function sgtReady() {
    console.log('SGT is ready');
    $(".btn-success").click(addClicked);
    $(".btn-default").click(cancelClicked);
    $('.avgGrade').text(0);
    $(".student-list-container").append("<h3><strong>User Info Unavailable</strong></h3>");
    $('.btn-primary').click(serverClicked);
    deleteClicked();
    reset();
}

function addClicked(){
    addStudent();
    clearAddStudentForm();
    updateData();
}

function cancelClicked(){
    clearAddStudentForm();
}

function deleteClicked() {
    $('tbody').on('click', 'button', function(){
        removeStudent(event);
    });
}

function serverClicked() {
    getFromServer();
}

function addStudent(){
    var student_object = {
        name: $("#studentName").val(),
        course: $("#course").val(),
        grade: $("#studentGrade").val()
    };
    student_array.push(student_object);
    updateStudentList();
    $(".student-list-container h3").remove();
}

function updateStudentList(){
    $('tbody tr').remove();
    for(var i = 0; i < student_array.length; i++){
        addStudentToDom(student_array[i]);
    }
    calculateAverage();
}

function addStudentToDom(studentObj){
    var row = $("<tr>");
    var nameTd = $("<td>").text(studentObj.name);
    var courseTd = $("<td>").text(studentObj.course);
    var gradeTd = $("<td>").text(studentObj.grade);
    var deleteButton = $("<button>").html('Delete').addClass('btn btn-danger btn-xs');
    var deleteTd = $("<td>").html(deleteButton);
    row.append(nameTd,courseTd,gradeTd,deleteTd);
    $("tbody").append(row);
}

function clearAddStudentForm(){
    console.log('clear');
    $("#studentName").val('');
    $("#course").val('');
    $("#studentGrade").val('');
}

function calculateAverage(){
    var total = 0;
    for(var j = 0; j < student_array.length; j++){
        total += parseInt(student_array[j].grade);
    }
    return Math.round(total / student_array.length);
}

function updateData() {
    updateStudentList();
    if(isNaN(calculateAverage()) == true){
        $('.avgGrade').text(0);
    }else{
        $('.avgGrade').text(calculateAverage);
    }
}

function reset() {
    student_array = [];
    updateData();
    clearAddStudentForm();
    $('.avgGrade').text(0);
}
function removeStudent(event) {
    console.log('removeStudent');
    var rowIndex = $(event.target).parents('tr');
    rowIndex = rowIndex[0].rowIndex;
    student_array.splice(rowIndex-1,1);
    updateData();
}

function getFromServer() {
    $.ajax({
        url: 'http://s-apis.learningfuze.com/sgt/get',
        dataType: 'json',
        method: 'post',
        data : {api_key: "jdfv5s9ZMx"},
        success: function(response) {
            console.log("call success", response);
            for (var b = 0; b < response.data.length; b++){
                console.log(response.data[b]);
                student_array.push(response.data[b]);
                updateData();
                $(".student-list-container h3").remove();
            }
        }
    });
}