$(".inner-switch" ).on("click", function(
    ){
    
      if( $("body").hasClass("dark")){
        $("body" ).removeClass( "dark ");
        $(".inner-switch").text("OFF");
      }else{
        $("body").addClass("dark");
        $(".inner-switch").text("ON");
      }
    });
    function calories() {
      function find(id) { return document.getElementById(id) }
      var age = find("age").value,  height = find("height").value * 2.54,  weight = find("weight").value / 2.2,  result = 0
      if (find("male").checked) 
        result = 66.47 + (13.75 * weight) + (5.0 * height - (6.75 * age))
      else if (find("female").checked)
        result = 665.09 + (9.56 * weight) + (1.84 * height - (4.67 * age))
      find("totalCals").innerHTML = Math.round( result )
    }
    calories();
    function Bmicalculator() {
      var weight = document.bmiForm.weight.value, height = document.bmiForm.height.value
       if(weight > 0 && height > 0){	
      var finalBmi = weight/(height*height)*703
      document.bmiForm.bmi.value = finalBmi
       if(finalBmi < 18.5){
      document.bmiForm.meaning.value = "You may be underweight!"
        }
        if(finalBmi >= 18.5 && finalBmi < 25){
      document.bmiForm.meaning.value = "Congratulations! You are healthy!"
        }
        if(finalBmi >= 25){
      document.bmiForm.meaning.value = "You may be overweight!"
        }
      }
      else{
      alert("Please fill in everything correctly!")
        }
      }

