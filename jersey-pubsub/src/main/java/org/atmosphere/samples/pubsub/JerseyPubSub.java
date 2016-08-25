/*
 * Copyright 2016 Async-IO.org
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
package org.atmosphere.samples.pubsub;

import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import org.atmosphere.annotation.Broadcast;
import org.atmosphere.cpr.Broadcaster;
import org.atmosphere.cpr.BroadcasterFactory;
import org.atmosphere.cpr.Universe;
import org.atmosphere.jersey.Broadcastable;
import org.atmosphere.jersey.SuspendResponse;

/**
 * Simple PubSub resource that demonstrate many functionality supported by
 * Atmosphere Javascript and Atmosphere Jersey extension.
 *
 * @author Jeanfrancois Arcand
 */
@Path("/pubsub/{canal}")
public class JerseyPubSub {

	private BroadcasterFactory factory;
	
	@PathParam("canal")
	String canal;
	
	@GET
	public SuspendResponse<String> subscribe() {
		factory = Universe.broadcasterFactory();
		
		Broadcaster br = getBroadcaster(canal, true);
		System.out.println("Fazendo inscrição para " + br.getID());
		
		return new SuspendResponse.SuspendResponseBuilder<String>().broadcaster(br).outputComments(true)
				.addListener(new EventsLogger()).build();
	}
	
	@POST
	@Broadcast
	@Produces("text/html;charset=ISO-8859-1")
	public Broadcastable publishAA(@FormParam("message") String message) {
		factory = Universe.broadcasterFactory();
		message = message == null ? "random" : message;
		Broadcaster br = getBroadcaster(canal, false);
		if (br == null) {
			System.out.println("Nao deu");
			return null;
		}
		System.out.println("Enviando mensagem " + message + " para " + br.getID());

		return new Broadcastable(message, "", br);
	}

	private synchronized Broadcaster getBroadcaster(String canal, boolean criar) {
		return factory.lookup(canal, criar);
	}
}
