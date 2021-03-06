package com.subgraph.vega.application.update;

import java.net.URL;

import org.apache.http.HttpHost;
import org.apache.http.client.methods.HttpUriRequest;
import org.eclipse.jface.dialogs.MessageDialog;
import org.eclipse.swt.widgets.Shell;
import org.eclipse.ui.PlatformUI;
import org.eclipse.ui.browser.IWebBrowser;

import com.subgraph.vega.api.http.requests.IHttpRequestEngine;
import com.subgraph.vega.api.http.requests.IHttpRequestEngineConfig;
import com.subgraph.vega.api.http.requests.IHttpRequestEngineFactory;
import com.subgraph.vega.api.http.requests.IHttpRequestTask;
import com.subgraph.vega.api.http.requests.IHttpResponse;
import com.subgraph.vega.api.http.requests.RequestEngineException;
import com.subgraph.vega.application.Activator;

public class UpdateCheckTask implements Runnable {

	private final static String REPONSE_UPDATE_AVAILABLE = "UPDATE";
	private final static String DOWNLOAD_URL = "http://subgraph.com/vega_download.php";
	private final static String UPDATE_MESSAGE = 
			"A new version of Vega is available for download from the Subgraph website.\n"+ DOWNLOAD_URL;
	
	private final Shell shell;
	private final int buildNumber;
	
	public UpdateCheckTask(Shell shell, int buildNumber) {
		this.shell = shell;
		this.buildNumber = buildNumber;
	}

	@Override
	public void run() {
		
		final IHttpRequestEngine requestEngine = createRequestEngine();
		final IHttpResponse response = sendRequest(requestEngine);
		if(response != null && !response.getBodyAsString().isEmpty()) {
			processResponseBody(response.getBodyAsString());
		}
	}
	
	private IHttpResponse sendRequest(IHttpRequestEngine requestEngine) {
		final HttpHost targetHost = createTargetHost();
		final String uri = createUriPath();
		final HttpUriRequest request = requestEngine.createGetRequest(targetHost, uri);
		final IHttpRequestTask requestTask = requestEngine.sendRequest(request);
		try {
			return requestTask.get(true);
		} catch (RequestEngineException e) {
			return null;
		}
	}

	private void processResponseBody(String body) {
		if(!REPONSE_UPDATE_AVAILABLE.equalsIgnoreCase(body)) {
			return;
		}

		shell.getDisplay().asyncExec(new Runnable() {
			@Override
			public void run() {
				displayUpdateDialog();
			}
		});
	}

	private void displayUpdateDialog() {
		System.out.println("foo");
		final MessageDialog dialog = new MessageDialog(null, "Update Available", 
				null,
				UPDATE_MESSAGE,
				MessageDialog.INFORMATION,
				new String[] {"Ok", "Open Download Page"}, 
				0);
		if(dialog.open() == 1) {
			openDownloadPage();
		}

	}
	
	private void openDownloadPage() {
		try {
			final IWebBrowser browser = PlatformUI.getWorkbench().getBrowserSupport().getExternalBrowser();
			final URL url = new URL(DOWNLOAD_URL);
			browser.openURL(url);
		} catch (Exception e) {
		}
	}

	private IHttpRequestEngine createRequestEngine() {
		final IHttpRequestEngineFactory requestEngineFactory = Activator.getDefault().getHttpRequestEngineFactoryService();
		final IHttpRequestEngineConfig config = requestEngineFactory.createConfig();
		return requestEngineFactory.createRequestEngine(IHttpRequestEngine.EngineConfigType.CONFIG_SCANNER, config, null);
	}
	
	private HttpHost createTargetHost() {
		return new HttpHost("support.subgraph.com", -1, "https");
	}
	
	private String createUriPath() {
		return "/update-check.php?build="+buildNumber;
	}
}
