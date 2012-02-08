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
$one = ReplaceWithFile $_ "js/storage.js"
$two = ReplaceWithFile $one "js/enchantments.js"
$three = ReplaceWithFile $two "js/page.js"
$four = ReplaceWithFile $three "js/mc.js"
$five = ReplaceWithFile $four "js/iterator.js"
$six = ReplaceWithFile $five "js/tools.js"
$seven = ReplaceWithFile $six "js/collection.js"
$eight = ReplaceWithFile $seven "js/chart.js"
$nine = ReplaceWithFile $eight "js/jquery-1.7.1.min.js"
$ten = ReplaceWithCss $nine "css/bootstrap.min.css"
add-content mce.html $ten
}
