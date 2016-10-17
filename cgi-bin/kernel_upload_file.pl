#!/usr/bin/perl
#
# kernel_upload.pl - Demonstration script for file uploads
# over HTML form.
#
# This script should function as is.  Copy the file into
# a CGI directory, set the execute permissions, and point
# your browser to it. Then modify if to do something
# useful.
#
# Author: Kyle Dent
# Date: 3/15/01
#

use CGI;
use strict;

my $PROGNAME = "kernel_upload_file.pl";

my $cgi = new CGI();
print "Content-type: text/html\n\n";

my $stringN1 = 'Start of Feedback';
my $stringN2 = 'Second line of feedback';
my $stringN3 = 'Third line of feedback';

my $stringFeedbackTitle = 'Status area:';
my $stringTotalOutput = "";

#
# If we're invoked directly, display the form and get out.
#
if (! $cgi->param("button") ) {
#	DisplayFormRommel();
	DisplayFormNoJS();
	exit;
}

$stringTotalOutput = "button pressed";

#
# We're invoked from the form. Get the filename/handle.
#
my $upfile = $cgi->param('upfile');
my $upfile2 = $cgi->param('upfile2');
#print "Upfile:$upfile";
#print "Upfile:$upfile2";


#
# Get the basename in case we want to use it.
#
my $basename = GetBasename($upfile);
my $basename2 = GetBasename($upfile2);

#
# Set base pathname for remote end.
#
my $remotepath = "/tmp";

#
# At this point, do whatever we want with the file.
#
# We are going to use the scalar $upfile as a filehandle,
# but perl will complain so we turn off ref checking.
# The newer CGI::upload() function obviates the need for
# this. In new versions do $fh = $cgi->upload('upfile'); 
# to get a legitimate, clean filehandle.
#
no strict 'refs';
#my $fh = $cgi->upload('upfile'); 
#if (! $fh ) {
#	print "Can't get file handle to uploaded file.";
#	exit(-1);
#}

#######################################################
# Choose one of the techniques below to read the file.
# What you do with the contents is, of course, applica-
# tion specific. In these examples, we just write it to
# a temporary file. 
#
# With text files coming from a Windows client, probably
# you will want to strip out the extra linefeeds.
########################################################

#
# Get a handle to some file to store the contents
#
#if (! open(OUTFILE, ">/tmp/outfile.bin") ) {
#	print "Can't open /tmp/outfile.bin for writing - $!";
if (! open(OUTFILE, ">$remotepath/$basename") ) {
	print "Can't open $remotepath/$basename for writing - $!";
	exit(-1);
}

# give some feedback to browser
#print "Saving the file to $remotepath/$basename<br>\n";
#print "Saving the file to /tmp/outfile.bin<br>\n";

#
# 1. If we know it's a text file, strip carriage returns
#    and write it out.
#
#while (<$upfile>) {
# or 
#while (<$fh>) {
#	s/\r//;
#	print OUTFILE "$_";
#}

#
# 2. If it's binary or we're not sure...
#
my $nBytes = 0;
my $totBytes = 0;
my $buffer = "";
# If you're on Windows, you'll need this. Otherwise, it
# has no effect.
binmode($upfile);
#binmode($fh);
while ( $nBytes = read($upfile, $buffer, 1024) ) {
#while ( $nBytes = read($fh, $buffer, 1024) ) {
	print OUTFILE $buffer;
	$totBytes += $nBytes;
}

close(OUTFILE);

# more lame feedback
#print "thanks for uploading $basename ($totBytes bytes)<br>\n";	
#print "Upload filename: $remotepath/$basename<br>";

$stringTotalOutput = "Thanks for uploading $basename ($totBytes bytes)<br>\n";



if (! open(OUTFILE, ">$remotepath/$basename2") ) {
	print "Can't open $remotepath/$basename2 for writing - $!";
	exit(-1);
}

# give some feedback to browser
#print "Saving the file to $remotepath/$basename2<br>\n";

#
# 2. If it's binary or we're not sure...
#
my $nBytes = 0;
my $totBytes = 0;
my $buffer = "";
# If you're on Windows, you'll need this. Otherwise, it
# has no effect.
binmode($upfile2);
#binmode($fh);
while ( $nBytes = read($upfile2, $buffer, 1024) ) {
#while ( $nBytes = read($fh, $buffer, 1024) ) {
	print OUTFILE $buffer;
	$totBytes += $nBytes;
}

close(OUTFILE);
#
# Turn ref checking back on.
#
use strict 'refs';

# more lame feedback
#print "thanks for uploading $basename2 ($totBytes bytes)<br>\n";	
#print "Upload filename: $remotepath/$basename2<br>";

$stringTotalOutput = $stringTotalOutput . "Thanks for uploading $basename2 ($totBytes bytes)<br>\n";
DisplayFormWithJS();

my @fileupdate_args = ("/inspire/masterfile/kernel_update", "$remotepath/$basename2", "$remotepath/$basename");
#print @fileupdate_args;
$stringTotalOutput = $stringTotalOutput . "@fileupdate_args" . "\n<br>";
#DisplayFormWithJS();

my $ret_val = system(@fileupdate_args);
#system(@fileupdate_args) == 0
#	or die "system @fileupdate_args failed: $?";
#$stringTotalOutput = $stringTotalOutput . $stringN1 . "<br>" . $stringN2 . "\n" . $stringN3 . 'Finished';
$stringTotalOutput = $stringTotalOutput . "Return Value:" . $ret_val . "\n<br>";
if ( $ret_val == 0 ) {
    $stringTotalOutput = $stringTotalOutput . "Success";
}
else {
    $stringTotalOutput = $stringTotalOutput . "ERROR";
}

#DisplayFormWithJS();

#if ( $ret_val == 0 ) {
    DisplayFormReboot();
    #print "Restarting system...";
system("reboot");
#}

##############################################
# Subroutines
##############################################

#
# GetBasename - delivers filename portion of a fullpath.
#
sub GetBasename {
	my $fullname = shift;

	my(@parts);
	# check which way our slashes go.
	if ( $fullname =~ /(\\)/ ) {
		@parts = split(/\\/, $fullname);
	} else {
		@parts = split(/\//, $fullname);
	}

	return(pop(@parts));
}

#
# DisplayForm - spits out HTML to display our upload form.
#
sub DisplayFormNoJS {
# script is in separate js file
print <<"HTML";
<html>
<head>
	<link rel="stylesheet" href="/style.css">	
	<style>
	body { margin: 0;}
	.title { top: 20; }
	.panel { display: block; }
		form {
			margin-left: 100px;
		}
		form div {
			margin-bottom: 20px;
			font-size: 16px;
		}
		form div label {
			width: 400px;
			display: block;
		}	
		form input[type=submit] {
			font-size: 20px;
			padding: 10px;
		}
		.bottom-strip a {
			display: block;
			top: 420px;
			left: 0px;
			width: 100px;
			height: 60px;
		}
		.upload-feedback{
			position: absolute;
			left: 375px;
			top: 0;
			width: 400px;
		}
	}
	</style>
</head>
<title>Kernel Upload Form</title>
<body>
	<div class="container">
		<div class="panel">
			<div class="title"><span>Firmware Updates (kernel)</span></div>
			<div class="content">
				<form id="k1" method="post" action="$PROGNAME" enctype="multipart/form-data">
				<div><label for="upfile">Enter a file to upload:<br>
					<i>Must be called </i><b>md5_kernel.txt</b></label>
					<input type="file" name="upfile" id="upfile"></div>
				<div><label for="upfile2">Enter another file to upload:<br>
					<i>Must be called </i><b>ui.uImage</b></label>
					<input type="file" name="upfile2" id="upfile2"></div>
				<input type="submit" class="upload-form" name="button" value="Upload File(s)">
				</form>
				<div class="upload-feedback">$stringFeedbackTitle<br>$stringTotalOutput</div>
			</div>
			<div class="bottom-strip">
				<div data-panel="home" id="go-straight-home" class="go-straight-home"><a href="/">home</a></div>
			</div>
		</div>
	</div>
</body>
</html>
HTML

}

sub DisplayFormWithJS {
# script is in separate js file
print <<"HTML";
<html>
<head>
	<link rel="stylesheet" href="/style.css">	
	<style>
	body { margin: 0;}
	.title { top: 20; }
	.panel { display: block; }
		form {
			margin-left: 100px;
		}
		form div {
			margin-bottom: 20px;
			font-size: 16px;
		}
		form div label {
			width: 400px;
			display: block;
		}	
		form input[type=submit] {
			font-size: 20px;
			padding: 10px;
		}
		.bottom-strip a {
			display: block;
			top: 420px;
			left: 0px;
			width: 100px;
			height: 60px;
		}
		.upload-feedback{
			position: absolute;
			font-size: 10px;
			left: 375px;
			top: 0;
			width: 400px;
			height: 270px;
			overflow: auto;
		}
	}
	</style>
</head>
<title>Kernel Upload Form</title>
<body>
	<div class="container">
		<div class="panel">
			<div class="title"><span>Firmware Updates (kernel)</span></div>
			<div class="content">
				<div><label for="upfile">Enter a file to upload:<br>
					<i>Must be called </i><b>md5_kernel.txt</b></label>
					<br>"Filename:"<b>$basename</b><br>
				</div>
				<div><label for="upfile2">Enter another file to upload:<br>
					<i>Must be called </i><b>ui.uImage</b></label>
					<br>"Filename:"<b>$basename2</b><br>
				</div>
				<div class="upload-feedback">$stringFeedbackTitle<br>
					$stringTotalOutput</div>
			</div>
			<div class="bottom-strip">
				<div data-panel="home" id="go-straight-home" class="go-straight-home"><a href="/">home</a></div>
			</div>
		</div>
	</div>
	<input type="hidden" value="$remotepath/$basename" id="upload-filename"/>
</body>
<script type="text/javascript" src="/scripts/jquery-2.1.4.min.js"></script>
<script type="text/javascript" src="/scripts/firmwareUI.js"></script>
</html>
HTML

}


sub DisplayFormReboot() {
print <<"HTML";
<html>
<head>
	<link rel="stylesheet" href="/style.css">	
	<style>
	body { margin: 0;}
	.title { top: 0; }
	.panel { display: block; }
		form {
			margin-left: 100px;
		}
		form div {
			margin-bottom: 20px;
			font-size: 16px;
		}
		form div label {
			width: 400px;
			display: block;
		}	
		form input[type=submit] {
			font-size: 20px;
			padding: 10px;
		}
		.bottom-strip a {
			display: block;
			top: 420px;
			left: 0px;
			width: 100px;
			height: 60px;
		}
		.upload-feedback{
			position: absolute;
			left: 375px;
			top: 0;
			width: 400px;
		}
	}
	</style>
</head>
<title>Kernel Upload Form</title>
<body>
	<div class="container">
		<div class="panel">
			<div class="title"><span>REBOOTING Firmware Updates (kernel)</span></div>
			<div class="content">
				<div><label for="upfile">Enter a file to upload:<br>
					<i>Must be called </i><b>md5_kernel.txt</b></label>
					<br>"Filename:"<b>$basename</b><br>
				</div>
				<div><label for="upfile2">Enter another file to upload:<br>
					<i>Must be called </i><b>ui.uImage</b></label>
					<br>"Filename:"<b>$basename2</b><br>
				</div>
				<div class="upload-feedback">$stringFeedbackTitle<br>
					$stringTotalOutput<br>Rebooting...</div>
			</div>
			<div class="bottom-strip">
				<div data-panel="home" id="go-straight-home" class="go-straight-home"><a href="/">home</a></div>
			</div>
		</div>
	</div>
</body>
</html>
HTML
}

sub DisplayFormRommel {
# script is included in HTML
print <<"HTML";
<html>
<head>
	<link rel="stylesheet" href="/style.css">	
	<style>
	body { margin: 0;}
	.title { top: 0; }
	.panel { display: block; }
		form {
			margin-left: 100px;
		}
		form div {
			margin-bottom: 20px;
			font-size: 16px;
		}
		form div label {
			width: 400px;
			display: block;
		}	
		form input[type=submit] {
			font-size: 20px;
			padding: 10px;
		}
	}
	</style>
</head>
<title>Kernel Upload Form</title>
<body>
	<div class="container">
		<div class="panel">
			<div class="title"><span>Firmware Updates (kernel)</span></div>
			<div class="content">
				<form method="post" action="$PROGNAME" enctype="multipart/form-data">
				<div>"NOT IMPLEMENTED YET"</div>
				<div><label for="upfile">Enter a file to upload:<br>
					<i>Must be called </i><b>ui.uImage</b></label>
					<input type="file" name="upfile" id="upfile"></div>
				<div><label for="upfile2">Enter another file to upload:<br>
					<i>Must be called </i><b>md5_kernel.txt</b></label>
					<input type="file" name="upfile2" id="upfile2"></div>
				<input type="submit" class="upload-form" name="button" value="Upload File(s)">
				</form>
			<div class="bottom-strip">
				<div data-panel="home" id="go-straight-home" class="go-straight-home"><a href="/">home</a></div>
			</div>
			</div>
		</div>

	</div>
</body>
<script src="/scripts/jquery-2.1.4.min.js"></script>
<script>
var FirmwareUI = {

	initialize: function () {
		$('.upload-form').on('mousedown',function() {
			alert('javascript can be executed before submit');
		//	return false;
		});
	}
} // end of FirmwareUI

<!-- $(document).ready(FirmwareUI.initialize); -->
$(document).alert("Form Displayed");
	
</script>
</html>
HTML

}


