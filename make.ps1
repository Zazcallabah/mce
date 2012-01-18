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
$one = ReplaceWithFile $_ "storage.js"
$two = ReplaceWithFile $one "enchantments.js"
$three = ReplaceWithFile $two "page.js"
$four = ReplaceWithFile $three "mc.js"
$five = ReplaceWithFile $four "iterator.js"
$six = ReplaceWithFile $five "tools.js"
$seven = ReplaceWithFile $six "collection.js"
$eight = ReplaceWithFile $seven "chart.js"
Add-Content mce.html $eight
}

