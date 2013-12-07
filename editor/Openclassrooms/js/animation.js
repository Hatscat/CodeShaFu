console.log("on est avant la fonction")
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
$('#lessons a').click(function (e) 
{
  e.preventDefault()
  $(this).tab('show')
})