$(document).ready(sgtReady);

var student_array = [];


function sgtReady(){
    console.log('SGT is ready');
    $(".btn-success").click(addClicked);
    $(".btn-default").click(cancelClicked);
    $('.avgGrade').text(0);
    $(".student-list-container").append("<h3><strong>User Info Unavailable</strong></h3>");
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
    removeStudent();
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
    var deleteButton = $("<button>").html('Delete').addClass('delete_button btn btn-danger btn-xs');
    var deleteTd = $("<td>").html(deleteButton);
    row.append(nameTd,courseTd,gradeTd,deleteTd);
    $("tbody").append(row);
    $(".delete_button").click(deleteClicked);
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
    $('.avgGrade').text(calculateAverage);
}

function reset() {
    student_array = [];
    updateData();
    clearAddStudentForm();
    $('.avgGrade').text(0);
}
function removeStudent() {
    console.log('removeStudent');
    var selectedRow = $(event.target).parent();
    student_array.splice(selectedRow,1);
    updateData();
}