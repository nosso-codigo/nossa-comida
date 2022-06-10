package br.com.nosso.codigo.comida.web.rest;

import static javax.ws.rs.core.UriBuilder.fromPath;

import br.com.nosso.codigo.comida.domain.Cardapio;
import br.com.nosso.codigo.comida.web.rest.errors.BadRequestAlertException;
import br.com.nosso.codigo.comida.web.util.HeaderUtil;
import br.com.nosso.codigo.comida.web.util.ResponseUtil;
import java.util.List;
import java.util.Optional;
import javax.enterprise.context.ApplicationScoped;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.*;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * REST controller for managing {@link br.com.nosso.codigo.comida.domain.Cardapio}.
 */
@Path("/api/cardapios")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@ApplicationScoped
public class CardapioResource {

    private final Logger log = LoggerFactory.getLogger(CardapioResource.class);

    private static final String ENTITY_NAME = "cardapio";

    @ConfigProperty(name = "application.name")
    String applicationName;

    /**
     * {@code POST  /cardapios} : Create a new cardapio.
     *
     * @param cardapio the cardapio to create.
     * @return the {@link Response} with status {@code 201 (Created)} and with body the new cardapio, or with status {@code 400 (Bad Request)} if the cardapio has already an ID.
     */
    @POST
    @Transactional
    public Response createCardapio(Cardapio cardapio, @Context UriInfo uriInfo) {
        log.debug("REST request to save Cardapio : {}", cardapio);
        if (cardapio.id != null) {
            throw new BadRequestAlertException("A new cardapio cannot already have an ID", ENTITY_NAME, "idexists");
        }
        var result = Cardapio.persistOrUpdate(cardapio);
        var response = Response.created(fromPath(uriInfo.getPath()).path(result.id.toString()).build()).entity(result);
        HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.id.toString()).forEach(response::header);
        return response.build();
    }

    /**
     * {@code PUT  /cardapios} : Updates an existing cardapio.
     *
     * @param cardapio the cardapio to update.
     * @return the {@link Response} with status {@code 200 (OK)} and with body the updated cardapio,
     * or with status {@code 400 (Bad Request)} if the cardapio is not valid,
     * or with status {@code 500 (Internal Server Error)} if the cardapio couldn't be updated.
     */
    @PUT
    @Path("/{id}")
    @Transactional
    public Response updateCardapio(Cardapio cardapio, @PathParam("id") Long id) {
        log.debug("REST request to update Cardapio : {}", cardapio);
        if (cardapio.id == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        var result = Cardapio.persistOrUpdate(cardapio);
        var response = Response.ok().entity(result);
        HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, cardapio.id.toString()).forEach(response::header);
        return response.build();
    }

    /**
     * {@code DELETE  /cardapios/:id} : delete the "id" cardapio.
     *
     * @param id the id of the cardapio to delete.
     * @return the {@link Response} with status {@code 204 (NO_CONTENT)}.
     */
    @DELETE
    @Path("/{id}")
    @Transactional
    public Response deleteCardapio(@PathParam("id") Long id) {
        log.debug("REST request to delete Cardapio : {}", id);
        Cardapio
            .findByIdOptional(id)
            .ifPresent(
                cardapio -> {
                    cardapio.delete();
                }
            );
        var response = Response.noContent();
        HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()).forEach(response::header);
        return response.build();
    }

    /**
     * {@code GET  /cardapios} : get all the cardapios.
     *     * @return the {@link Response} with status {@code 200 (OK)} and the list of cardapios in body.
     */
    @GET
    public List<Cardapio> getAllCardapios() {
        log.debug("REST request to get all Cardapios");
        return Cardapio.findAll().list();
    }

    /**
     * {@code GET  /cardapios/:id} : get the "id" cardapio.
     *
     * @param id the id of the cardapio to retrieve.
     * @return the {@link Response} with status {@code 200 (OK)} and with body the cardapio, or with status {@code 404 (Not Found)}.
     */
    @GET
    @Path("/{id}")
    public Response getCardapio(@PathParam("id") Long id) {
        log.debug("REST request to get Cardapio : {}", id);
        Optional<Cardapio> cardapio = Cardapio.findByIdOptional(id);
        return ResponseUtil.wrapOrNotFound(cardapio);
    }
}
