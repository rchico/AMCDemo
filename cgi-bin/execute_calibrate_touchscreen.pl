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
# Author: Graham Taylor-Jones
# Date: 10/28/15
#

use CGI;
use strict;

my $PROGNAME = "execute_calibrate_touchscreen.pl";

my $cgi = new CGI();
#DisplayStartOfPage();
print "Content-type: text/html\n\n";

# Add printout messages to string so it may be used later (or not)
my $stringTotalOutput = "";


#DisplayFormWithJS();

#my @function_call_args = ("rm /nonvolatile/etc/pointercal && pkill qtb* && /inspire/app/ts_calibrate && /inspire/masterfile/start_qt");

my $retVal = 0;
$retVal = system("rm /nonvolatile/etc/pointercal");
$stringTotalOutput = "Remove Cal file. Ret=$retVal\n<br>";

$retVal = system("pkill -9 qtb*");
$stringTotalOutput = $stringTotalOutput . "Kill browser. Ret=$retVal\n<br>";

$retVal = system("/inspire/masterfile/ts_calibrate");
$stringTotalOutput = $stringTotalOutput . "Start Calibration. Ret=$retVal\n<br>";

#Future enhancement would be to "cat /proc/cmdline" and search for run=
$retVal = system("/inspire/masterfile/start_qt");
$stringTotalOutput = $stringTotalOutput . "Start Browser. Ret=$retVal\n<br>";

#system(@function_call_args) == 0
#	or die "system @function_call_args failed: $?";

#DisplayEndOfPage();
DisplayPage();
exit 0;

##############################################
# Subroutines
##############################################
sub DisplayStartOfPage {
print <<"HTML";
<html>
<head>
<title>Action Feedback Page</title>
<body>
<h1>Status Feedback</h1>"
HTML
}

sub DisplayEndOfPage {
print <<"HTML";
</body>
</html>
HTML
}

sub DisplayPage {
print <<"HTML";
<html>
<head>
<title>Action Feedback Page</title>
<body>
<h1>Status Feedback</h1>"
$stringTotalOutput
</body>
</html>
HTML
}
