<?php
	 /**
	  * Get the title of a document from a specific URL
	  * 
	  * @access global
	  * @param string url
	  * @return string title
	  */
	 function getTitle($url) {
	 	$d = file_get_contents($url);
		
		if (strlen($d) > 0) {
			preg_match("/\<title\>(.*)\<\/title\>/", $d, $title);
			
			return $title[1];
		}
		
		return null;
	 }