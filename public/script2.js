function WHtRcalculator() {
    var waist = document.waistToHeightForm.waist.value, height = document.waistToHeightForm.height.value
     if(waist > 0 && height > 0){	
    var finalWHtR = waist/height
    document.waistToHeightForm.WHtR.value = finalWHtR
     if(finalWHtR < 0.35){
    document.waistToHeightForm.meaning.value = "Abnormally slim to underweight! Recommended workout #1, #7, #11!"
      }
    if(finalWHtR >= 0.35 && finalWHtR < 0.43){
      document.waistToHeightForm.meaning.value = "Extremely slim! Recommended workout #5, #7, #8!"
    }
    if(finalWHtR >= 0.43 && finalWHtR < 0.46){
      document.waistToHeightForm.meaning.value = "Slender and healthy! Recommended workout #6, #12, #14!"
        }
    if(finalWHtR >= 0.46 && finalWHtR < 0.53){
      document.waistToHeightForm.meaning.value = "Healthy! Recommended workout #3, #10, #15!"
      }
    if(finalWHtR >= 0.53 && finalWHtR < 0.58){
      document.waistToHeightForm.meaning.value = "Overweight! Recommended workout #2, #4, #9!"
        }
    if(finalWHtR >= 0.58 && finalWHtR < 0.63){
      document.waistToHeightForm.meaning.value = "Extremely overweight! Recommended workout #5, #13, #14!"
        }
    if(finalWHtR > 0.63){
      document.waistToHeightForm.meaning.value = "Highly obese! Recommended workout #1 to #15!"
        }
    }
    else{
    alert("Please fill in everything correctly!")
      }
    }