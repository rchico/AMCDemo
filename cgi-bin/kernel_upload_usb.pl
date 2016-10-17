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

my $PROGNAME = "kernel_upload_usb.pl";

my $cgi = new CGI();
print "Content-type: text/html\n\n";

#
# If we're invoked directly, display the form and get out.
#
if (! $cgi->param("button") ) {
	DisplayForm();
	exit;
}

#
# We're invoked from the form. Get the filename/handle.
#

# give some feedback to browser
print "Invoking kernel_update";
my @fileupdate_args = ("/inspire/app/kernel_update");
DisplayFormPostSelection();
system(@fileupdate_args) == 0
	or die "system @fileupdate_args failed: $?";
print "Restarting system...";
system("reboot");


##############################################
# Subroutines
##############################################


#
# DisplayForm - spits out HTML to display our upload form.
#
sub DisplayForm {
print <<"HTML";
<html>
<head>
	<link rel="stylesheet" href="/style.css">	
	<style>
	body { margin: 0;}
	.title { top: 20; }
	.panel { display: block; }
		form {
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
			width: 100px;
			height: 60px;
		}
	}
	</style>
</head>
<title>Update UI - Kernel Upload Form</title>
<body>
	<div class="container">
		<div class="panel">
			<div class="title"><span>Update UI Firmware</span></div>
			<div class="content">
				<center>
				This will upload the new kernel from the USB on the controller.<br>
				Make sure that the USB drive is plugged into controller.<br>
				<br>

				<form method="post" action="$PROGNAME" enctype="multipart/form-data">
				<input type="submit" class="upload-form" name="button" value="Start Transfer">
				</center>
				</form>
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

#
# DisplayForm - spits out HTML to display our upload form.
#
sub DisplayFormPostSelection {
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
			width: 100px;
			height: 60px;
		}
	}
	</style>
</head>
<title>Update UI - Kernel Upload Form</title>
<body>
	<div class="container">
		<div class="panel">
			<div class="title"><span>Update UI Firmware</span></div>
			<div class="content">
				<center>
				This will upload the new kernel from the USB on the controller.<br>
				Make sure that the USB drive is plugged into controller.<br>
				<br>

				Transfer has been started.
				It may take a couple of minutes before the UI will restart.
				</center>
				</form>
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

