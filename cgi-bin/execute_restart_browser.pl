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

my $PROGNAME = "execute_restart_browser.pl";

my $cgi = new CGI();
print "Content-type: text/html\n\n";

# Add printout messages to string so it may be used later (or not)
my $stringTotalOutput = "";

my $retVal = 0;
$retVal = system("pkill -9 qtb*");
$stringTotalOutput = $stringTotalOutput . "Kill browser. Ret=$retVal\n<br>";

#Future enhancement would be to "cat /proc/cmdline" and search for run=
$retVal = system("/inspire/masterfile/start_qt");
$stringTotalOutput = $stringTotalOutput . "Start Browser. Ret=$retVal\n<br>";


##############################################
# Subroutines
##############################################


