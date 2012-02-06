function MakePattern( $name )
{
	[String]::Format("<script type=""text/javascript"" src=""{0}""></script>", $name)
}

function ReplaceWithFile( $str, $name ) {
	$pattern = MakePattern $name
	$filecontents = gc $name
	$replacementdata = [String]::Format("<script type=""text/javascript"">{0}</script>" , [String]::Join("`n",$filecontents))
	$str.Replace( $pattern, $replacementdata );
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
Add-Content mce.html $nine
}

