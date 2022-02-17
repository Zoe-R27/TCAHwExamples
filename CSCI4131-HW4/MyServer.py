#!/usr/bin/env python3
# See https://docs.python.org/3.2/library/socket.html
# for a decscription of python socket and its parameters
import socket

#added following modules for refactoring
import os
import stat
import sys
import urllib.parse
import datetime

from threading import Thread
from argparse import ArgumentParser

BUFSIZE = 4096

#added macros
CRLF = '\r\n'
METHOD_NOT_ALLOWED = 'HTTP/1.1 405 METHOD NOT ALLOWED{}ALLOW: GET, HEAD, POST'
OK = 'HTTP/1.1 200 OK{}{}{}'.format(CRLF, CRLF, CRLF) # head request only
NOT_FOUND = 'HTTP/1.1 404 NOT FOUND{}Connection: close{}{}'.format(CRLF, CRLF, CRLF)
FORBIDDEN = 'HTTP/1.1 403 FORBIDDEN{}Connection: close{}{}'.format(CRLF, CRLF, CRLF)

#head requests, get contents of text or html files
def get_contents(fname):
	with open(fname, 'r') as f:
		return f.read()

def check_perms(resource):
	"""Returns True if resource has read permissions set on 'others'"""
	stmode = os.stat(resource).st_mode
	return (getattr(stat,'S_IROTH') & stmode) > 0

class HTTP_HeadServer:
	def __init__(self, host, port):
		print("Server")
		print('listening on port {}'.format(port))
		self.host = host
		self.port = port

		self.setup_socket()

		self.accept()

		self.sock.shutdown()
		self.sock.close()

	def setup_socket(self):
		self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
		self.sock.bind((self.host, self.port))
		self.sock.listen(128)

#Refactored
	def accept(self):
		while True:
			(client, address) = self.sock.accept()
			# th = Thread(target=client_talk, args=(client, address))
			th = Thread(target=self.accept_request, args=(client, address))
			th.start()

	def accept_request(self, client_sock, client_addr):
		print("accept request")
		data = client_sock.recv(BUFSIZE)
		req = data.decode('utf-8') #returns a string
		response=self.process_request(req) #returns a string

		client_sock.send(response)

		client_sock.shutdown(1)
		client_sock.close()

	def process_request(self, request):
		print('#######\nREQUEST:\n{}######'.format(request))
		linelist = request.strip().split(CRLF)
		reqline = linelist[0]
		rlwords = reqline.split()
		# print(rlwords)
		if (rlwords) == 0:
			return ''
		if rlwords[0] == "HEAD":
			resource = rlwords[1][1:] # skip beginning/
			return self.head_request(resource)
		elif rlwords[0] == "GET":
			resource = rlwords[1][1:]
			return self.get_request(resource)
		elif rlwords[0] == "POST":
			resource = linelist[-1]
			return self.post_request(resource)
		else: #add ELIF checks for GET and POST before this else...
			header = METHOD_NOT_ALLOWED
			result = bytes(header, 'utf-8')
			# result += self.get_media_contents("./405.html")

			return result

	def head_request(self, resource):
		"""Handles HEAD request """
		path = os.path.join('.', resource) #look in current directory where server is
		if not os.path.exists(resource):
			ret = NOT_FOUND
		elif not check_perms(resource):
			ret = FORBIDDEN
		else:
			ret = OK
		return bytes(ret, 'utf-8')

	def get_request(self, resource):
		"""Handles GET request"""
		# print (resource)
		# status = self.head_request(resource)
		path = os.path.join('.', resource) #look in current directory where server is
		if ("redirect" in resource):
			content = resource.split('=')
			request = content[1]
			# print (request)
			header = "HTTP/1.1 307 TEMPORARY REDIRECT\n"
			location = "Location: https://www.youtube.com/results?search_query=" + request
			header += location
			# print (header)
			result = bytes(header, 'utf-8')
			return result
		elif not os.path.exists(resource):
			header = NOT_FOUND
			result = bytes(header, 'utf-8')
			result += self.get_media_contents("./404.html")
			return result
		elif not check_perms(resource):
			header = FORBIDDEN
			result = bytes(header, 'utf-8')
			result += self.get_media_contents("./403.html")
			return result

		else:
			header = "HTTP/1.1 200 OK\n"
			# print (header)
			content = resource.split('.')
			type = content[1]
			if (type == "png"):
				header += 'Content-Type: image/png\n\n'
			elif (type == "jpg"):
				header += "Content-Type: image/jpg\n\n"
			elif (type == "html"):
				header += "Content-Type: text/html\n\n"
			elif (type == "mp3"):
				header += "Content-Type: audio/mp3\n\n"
			elif (type == "css"):
				header += "Content-Type: text/css\n\n"
			elif (type == "js"):
				header += "Content-Type: application/javascript\n\n"

			# print (header)
			path = os.path.join('.', resource)
			result = bytes(header, 'utf-8')
			result += self.get_media_contents(path)

			return result

	#helper method
	def get_media_contents(self, fname):
		with open(fname, 'rb') as f:
			return f.read()

	def post_request(self, resource):
		# print (resource)
		header = "HTTP/1.1 200 OK\nContent-Type: text/html\n\n"
		postString = '<!DOCTYPE html> <html lang="en"> <head>'
		postString += '<link rel="icon" href="data:,">'
		postString += '<meta charset="UTF-8"> <link rel="stylesheet" type="text/css" href="css/style.css"> '
		postString += '<meta name="viewport" content="width=device-width, initial-scale=1"></head>'
		postString += '<body><h1>Following Form Data Submitted Successfully:</h1><table>'
		content = resource.split('&')
		print (resource)
		for piece in content:
			postString += '<tr>'
			separate = piece.split('=')
			postString += '<td>'
			postString += urllib.parse.unquote(separate[0])
			postString += '</td>'
			postString += '<td>'
			postString += urllib.parse.unquote(separate[1])
			postString += '</td>'
			postString += '</tr>'
		postString += '</table></body></html>'
		print(postString)
		result = header + postString
		return bytes(result, 'utf-8')

def parse_args():
  parser = ArgumentParser()

  parser.add_argument('--host', type=str, default='localhost',
                      help='specify a host to operate on (default: localhost)')

  parser.add_argument('-p', '--port', type=int, default=9001,
                      help='specify a port to operate on (default: 9001)')
  args = parser.parse_args()
  return ('localhost', args.port)


if __name__ == '__main__':
  (host, port) = parse_args()
  HTTP_HeadServer(host, port)
