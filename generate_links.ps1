$services = Get-Content services_slugs.txt
$blogs = Get-Content blog_slugs.txt
$statics = Get-Content links_extracted.txt

$output = "# Të gjitha Linqet e Faqes për Testim`n`nKëtu është lista e plotë e të gjitha linqeve (mbi 120+) për testim manual.`n`n"
$output += "## Linqet e Shërbimeve`n"
foreach ($s in $services) {
    if ($s -ne "") {
        $output += "- [ ] [http://localhost:3000/sq/sherbimet/$s](http://localhost:3000/sq/sherbimet/$s)`n"
        $output += "- [ ] [http://localhost:3000/en/services/$s](http://localhost:3000/en/services/$s)`n"
    }
}
$output += "`n## Linqet e Blogut`n"
foreach ($b in $blogs) {
    if ($b -ne "") {
        $output += "- [ ] [http://localhost:3000/sq/blogu/$b](http://localhost:3000/sq/blogu/$b)`n"
        $output += "- [ ] [http://localhost:3000/en/blog/$b](http://localhost:3000/en/blog/$b)`n"
    }
}
$output += "`n## Linqet e Tjera (Statike dhe të Jashtme)`n"
foreach ($st in $statics) {
    if ($st -ne "") {
        $prefix = if ($st.StartsWith("http")) { "" } else { "http://localhost:3000" }
        $url = "$prefix$st"
        $output += "- [ ] [$url]($url)`n"
    }
}

[System.IO.File]::WriteAllText("C:\Users\Gaming\.gemini\antigravity\brain\9ff63034-4584-46a9-93e5-20eee5fccf2c\all_website_links.md", $output)
