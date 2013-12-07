$('#instructions a').click(function (e) 
{
  e.preventDefault()
  $(this).tab('show')

})
$('#code a').click(function (e) 
{
  e.preventDefault()
  $(this).tab('show')
})
$('#tips a').click(function (e) 
{
  e.preventDefault()
  $(this).tab('show')
})
$('#doc a').click(function (e) 
{
  e.preventDefault()
  $(this).tab('show')
})
//------------------resize de la text area---------------
$( "#editor" ).height( 340 );
aceEditor.resize();



