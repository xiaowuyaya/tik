//go:generate goversioninfo -manifest=goversioninfo.exe.manifest -icon=icon.ico
package main

import (
	"bytes"
	"compress/gzip"
	"crypto/tls"
	"flag"
	"fmt"
	"github.com/shirou/gopsutil/process"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"
)

func main() {
	var host string
	var port string
	var auth string
	var pid string
	flag.StringVar(&host, "h", "127.0.0.1:123", "主机名，默认为localhost")
	flag.StringVar(&port, "p", "8999", "端口号，默认为3306")
	flag.StringVar(&auth, "a", "kjashdkoiuo123", "验证信息头")
	flag.StringVar(&pid, "pid", "10956", "宿主进程id")
	flag.Parse()

	log.Println(fmt.Sprintf("[args] h: %v, p: %v, a: %v, pid: %v", host, port, auth, pid))

	VerOption.Port = port
	VerOption.Host = host
	VerOption.Auth = auth

	go checkMainProxyExist(pid)
	go keepRequestAlive(VerOption)
	Proxy(VerOption)

}

func checkMainProxyExist(pid string) {
	for range time.Tick(10 * time.Second) {
		pidStrconv, _ := strconv.ParseInt(pid, 10, 32)
		pid32 := int32(pidStrconv)
		pids, _ := process.Pids()
		var isExist bool = false
		for _, p := range pids {
			if p == pid32 {
				isExist = true
				break
			}
		}
		if !isExist {
			log.Println("main process is not exist.")
			os.Exit(3)
		}
	}
}

func keepRequestAlive(option Option) {
	for range time.Tick(1250 * time.Millisecond) {
		rootUrl := option.Host + "/lol-gameflow/v1/gameflow-phase"

		req, err := http.NewRequest(http.MethodGet, rootUrl, nil)
		if err != nil {
			log.Println("create request proxy fail")
			return
		}

		req.Header.Set("Connection", "keep-alive")
		req.Header.Set("Accept", "application/json")
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", option.Auth)

		res, err := client.Do(req)
		if err != nil {
			log.Println("proxy request sending error" + err.Error())
			return
		}

		defer res.Body.Close()

		var data []byte

		data, err = ioutil.ReadAll(res.Body)
		if err != nil {
			log.Println("ready response body fail")
			return
		}

		var dataOutPut []byte

		isGzipped := isGzipped(res.Header)

		if isGzipped {
			resProxyGzippedBody := ioutil.NopCloser(bytes.NewBuffer(data))
			defer resProxyGzippedBody.Close()

			gr, err := gzip.NewReader(resProxyGzippedBody)
			if err != nil {
				log.Println("create gzip reader fail")
				// 响应状态码
				return
			}
			defer gr.Close()

			dataOutPut, err = ioutil.ReadAll(gr)
			if err != nil {
				log.Println("read gzip body fail")
				return
			}
		} else {
			dataOutPut = data
		}

		log.Println(fmt.Sprintf("keep-alive result:%v", string(dataOutPut)))
	}
}

var server http.Server

var VerOption Option

const headerContentEncoding = "Content-Encoding"
const encodingGzip = "gzip"

type Option struct {
	Port string `yaml:"port"`
	Host string `yaml:"host"`
	Auth string `yaml:"auth"`
}

func Proxy(option Option) {
	port := ":" + option.Port
	server = http.Server{
		Addr: port,
	}
	log.Println(fmt.Sprintf("server running at: localhost:%v", option.Port))
	http.ListenAndServe(port, http.HandlerFunc(DoHandle))
}

func DoHandle(writer http.ResponseWriter, req *http.Request) {
	doProxy(writer, req, VerOption)
}

var transCfg = &http.Transport{
	TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
}
var client = &http.Client{Transport: transCfg}

func doProxy(w http.ResponseWriter, r *http.Request, option Option) {

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Println("read request body fail")
		w.WriteHeader(http.StatusServiceUnavailable)
		return
	}

	rootUrl := option.Host + r.URL.String()

	reqProxy, err := http.NewRequest(r.Method, rootUrl, strings.NewReader(string(body)))
	if err != nil {
		log.Println("create request proxy fail")
		w.WriteHeader(http.StatusServiceUnavailable)
		return
	}

	for k, v := range r.Header {
		reqProxy.Header.Set(k, v[0])
	}

	reqProxy.Header.Set("Connection", "keep-alive")
	reqProxy.Header.Set("Accept", "application/json")
	reqProxy.Header.Set("Content-Type", "application/json")
	reqProxy.Header.Set("Authorization", option.Auth)

	resProxy, err := client.Do(reqProxy)
	if err != nil {
		log.Println("proxy request sending error" + err.Error())
		w.WriteHeader(http.StatusServiceUnavailable)
		return
	}

	defer resProxy.Body.Close()

	for k, v := range resProxy.Header {
		w.Header().Set(k, v[0])
	}

	var data []byte

	data, err = ioutil.ReadAll(resProxy.Body)
	if err != nil {
		log.Println("ready response body fail")
		w.WriteHeader(http.StatusServiceUnavailable)
		return
	}

	var dataOutPut []byte

	isGzipped := isGzipped(resProxy.Header)

	if isGzipped {
		resProxyGzippedBody := ioutil.NopCloser(bytes.NewBuffer(data))
		defer resProxyGzippedBody.Close()

		gr, err := gzip.NewReader(resProxyGzippedBody)
		if err != nil {
			log.Println("create gzip reader fail")
			// 响应状态码
			w.WriteHeader(http.StatusServiceUnavailable)
			return
		}
		defer gr.Close()

		dataOutPut, err = ioutil.ReadAll(gr)
		if err != nil {
			log.Println("read gzip body fail")
			w.WriteHeader(http.StatusServiceUnavailable)
			return
		}
	} else {
		dataOutPut = data
	}

	log.Println(string(dataOutPut))

	resProxyBody := ioutil.NopCloser(bytes.NewBuffer(data))
	defer resProxyBody.Close()

	w.WriteHeader(resProxy.StatusCode)
	io.Copy(w, resProxyBody)

}

func isGzipped(header http.Header) bool {
	if header == nil {
		return false
	}

	contentEncoding := header.Get(headerContentEncoding)
	isGzipped := false
	if strings.Contains(contentEncoding, encodingGzip) {
		isGzipped = true
	}

	return isGzipped
}