function MakePattern( $name )
{
	[String]::Format("<script type=""text/javascript"" src=""{0}""></script>", $name)
}

function MakeCss( $name )
{
	[String]::Format("<link href=""{0}"" rel=""stylesheet""/>", $name );
}

function ReplaceWithFile( $str, $name ) {
	$pattern = MakePattern $name
	$filecontents = gc $name
	$replacementdata = [String]::Format("<script type=""text/javascript"">{0}</script>" , [String]::Join("`n",$filecontents))
	$str.Replace( $pattern, $replacementdata );
}

function ReplaceWithCss( $str, $name ) {
	$pattern = MakeCss $name
	$filec = gc $name
	$repl = [String]::Format("<style type=""text/css"">{0}</style>", [String]::Join("`n",$filec))
	$str.Replace( $pattern, $repl );
}
rm mce.html
gc index.html | Foreach-Object{
$one = ReplaceWithFile $_ "js/knockout.js"
$two = ReplaceWithFile $one "js/storage.js"
$three = ReplaceWithFile $two "js/tools.js"
$four = ReplaceWithFile $three "js/enchantments.js"
$five = ReplaceWithFile $four "js/viewmodel.js"
$six = ReplaceWithFile $five "js/page.js"
$seven = ReplaceWithFile $six "js/mc.js"
$nine = ReplaceWithFile $seven "js/simulation.js"
$ten = ReplaceWithCss $nine "css/bootstrap.min.css"
add-content mce.html $ten
}
