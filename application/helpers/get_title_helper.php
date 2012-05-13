<?php
	 /**
	  * Get the title of a document from a specific URL
	  * 
	  * @access global
	  * @param string url
	  * @return string title
	  */
	 function getTitle($url) {
	 	//$u = urlencode($url);
	 	$d = file_get_contents($url);
		if (strlen($d) > 0) {
			//preg_match("/\<title\>(.*|[[:space:]])\<\/title\>/", $d, $title);
			preg_match("~<title>(.*?)</title>~si", $d, $title);
			$title[1] = ltrim($title[1]);
			$title[1] = rtrim($title[1]);

			return $title[1];
		}
		
		return null;
	 }