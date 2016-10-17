#!/usr/bin/perl
#
# file_upload.pl - Demonstration script for file uploads
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

my $PROGNAME = "firmware_upload_file.pl";

my $cgi = new CGI();
print "Content-type: text/html\n\n";

my $stringTotalOutput = "";

#
# If we're invoked directly, display the form and get out.
#
if (! $cgi->param("button") ) {
#	DisplayFormRommel();
	DisplayFormNoJS();
	exit;
}

#
# We're invoked from the form. Get the filename/handle.
#
my $upfile = $cgi->param('upfile');
#print "Upfile:$upfile";


#
# Get the basename in case we want to use it.
#
my $basename = GetBasename($upfile);

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
if (! open(OUTFILE, ">$remotepath/$basename") ) {
	print "Can't open $remotepath/$basename for writing - $!";
#if (! open(OUTFILE, ">/tmp/outfile.bin") ) {
#	print "Can't open /tmp/outfile.bin for writing - $!";
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

#
# Turn ref checking back on.
#
use strict 'refs';

# more lame feedback
#print "thanks for uploading $basename ($totBytes bytes)<br>\n";	
#print "Upload filename: $remotepath/$basename<br>";

$stringTotalOutput = "Thanks for uploading $remotepath/$basename ($totBytes bytes)<br>\n";
DisplayFormWithJS();

#my @fileupdate_args = ("rgn_puppy", "$remotepath/$basename");
#my @fileupdate_args = ("rgn_puppy", "/tmp/outfile.bin");
#system(@fileupdate_args) == 0
#	or die "system @fileupdate_args failed: $?";

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
			width: 100px;
			height: 60px;
		}
		.upload-feedback{
			position: absolute;
			font-size: 12px;
			left: 375px;
			top: 0;
			width: 400px;
			height: 270px;
			overflow: auto;
		}
	}
	</style>
</head>
<title>Firmware Upload Form</title>
<body>
	<div class="container">
		<div class="panel">
			<div class="title"><span>Firmware Updates</span></div>
			<div class="content">
				<form id="k1" method="post" action="$PROGNAME" enctype="multipart/form-data">
				<div><label for="upfile">Enter a file to upload:<br>
					<i>Usually called: </i><b>XXX_app_VersionNo.bin</b></label>
					<input type="file" name="upfile" id="upfile"></div>
				<input type="submit" class="upload-form" name="button" value="Upload File">
				</form>
				<div class="upload-feedback">Status Output:</div>
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
			width: 100px;
			height: 60px;
		}
		.upload-feedback{
			position: absolute;
			font-size: 12px;
			left: 375px;
			top: 0;
			width: 400px;
			height: 270px;
			overflow: auto;
		}
	}
	</style>
</head>
<title>Firmware Upload Form</title>
<body>
	<div class="container">
		<div class="panel">
			<div class="title"><span>Firmware Updates</span></div>
			<div class="content">
				<div><label for="upfile">Enter a file to upload:<br>
					<i>Usually called: </i><b>XXX_app_VersionNo.bin</b></label><br>
					"Filename:"<b>$basename</b><br>
				<div class="upload-feedback">$stringTotalOutput</div>
			        </div>
                        </div>
			<div class="bottom-strip">
				<div data-panel="home" id="go-straight-home" class="go-straight-home"><a href="/">home</a></div>
			</div>
		</div>

	</div>
	<input type="hidden" value="$remotepath/$basename" id="upload-filename"/>
</body>
<script type="text/javascript" src="/scripts/jquery-2.1.4.min.js"></script>
<script type="text/javascript" src="/scripts/firmwareui.js"></script>
</html>
HTML

}


