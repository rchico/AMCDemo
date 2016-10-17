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

my $PROGNAME = "execute_reboot_interface.pl";

my $cgi = new CGI();
print "Content-type: text/html\n\n";

# Add printout messages to string so it may be used later (or not)
my $stringTotalOutput = "";

my @function_call_args = ("reboot");
system(@function_call_args) == 0
	or die "system @function_call_args failed: $?";

##############################################
# Subroutines
##############################################


