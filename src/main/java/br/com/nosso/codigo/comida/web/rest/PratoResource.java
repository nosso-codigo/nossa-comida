package br.com.nosso.codigo.comida.web.rest;

import static javax.ws.rs.core.UriBuilder.fromPath;

import br.com.nosso.codigo.comida.domain.Prato;
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
 * REST controller for managing {@link br.com.nosso.codigo.comida.domain.Prato}.
 */
@Path("/api/pratoes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@ApplicationScoped
public class PratoResource {

    private final Logger log = LoggerFactory.getLogger(PratoResource.class);

    private static final String ENTITY_NAME = "prato";

    @ConfigProperty(name = "application.name")
    String applicationName;

    /**
     * {@code POST  /pratoes} : Create a new prato.
     *
     * @param prato the prato to create.
     * @return the {@link Response} with status {@code 201 (Created)} and with body the new prato, or with status {@code 400 (Bad Request)} if the prato has already an ID.
     */
    @POST
    @Transactional
    public Response createPrato(Prato prato, @Context UriInfo uriInfo) {
        log.debug("REST request to save Prato : {}", prato);
        if (prato.id != null) {
            throw new BadRequestAlertException("A new prato cannot already have an ID", ENTITY_NAME, "idexists");
        }
        var result = Prato.persistOrUpdate(prato);
        var response = Response.created(fromPath(uriInfo.getPath()).path(result.id.toString()).build()).entity(result);
        HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.id.toString()).forEach(response::header);
        return response.build();
    }

    /**
     * {@code PUT  /pratoes} : Updates an existing prato.
     *
     * @param prato the prato to update.
     * @return the {@link Response} with status {@code 200 (OK)} and with body the updated prato,
     * or with status {@code 400 (Bad Request)} if the prato is not valid,
     * or with status {@code 500 (Internal Server Error)} if the prato couldn't be updated.
     */
    @PUT
    @Path("/{id}")
    @Transactional
    public Response updatePrato(Prato prato, @PathParam("id") Long id) {
        log.debug("REST request to update Prato : {}", prato);
        if (prato.id == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        var result = Prato.persistOrUpdate(prato);
        var response = Response.ok().entity(result);
        HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, prato.id.toString()).forEach(response::header);
        return response.build();
    }

    /**
     * {@code DELETE  /pratoes/:id} : delete the "id" prato.
     *
     * @param id the id of the prato to delete.
     * @return the {@link Response} with status {@code 204 (NO_CONTENT)}.
     */
    @DELETE
    @Path("/{id}")
    @Transactional
    public Response deletePrato(@PathParam("id") Long id) {
        log.debug("REST request to delete Prato : {}", id);
        Prato
            .findByIdOptional(id)
            .ifPresent(
                prato -> {
                    prato.delete();
                }
            );
        var response = Response.noContent();
        HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()).forEach(response::header);
        return response.build();
    }

    /**
     * {@code GET  /pratoes} : get all the pratoes.
     *     * @return the {@link Response} with status {@code 200 (OK)} and the list of pratoes in body.
     */
    @GET
    public List<Prato> getAllPratoes() {
        log.debug("REST request to get all Pratoes");
        return Prato.findAll().list();
    }

    /**
     * {@code GET  /pratoes/:id} : get the "id" prato.
     *
     * @param id the id of the prato to retrieve.
     * @return the {@link Response} with status {@code 200 (OK)} and with body the prato, or with status {@code 404 (Not Found)}.
     */
    @GET
    @Path("/{id}")
    public Response getPrato(@PathParam("id") Long id) {
        log.debug("REST request to get Prato : {}", id);
        Optional<Prato> prato = Prato.findByIdOptional(id);
        return ResponseUtil.wrapOrNotFound(prato);
    }
}
