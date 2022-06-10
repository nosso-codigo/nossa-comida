package br.com.nosso.codigo.comida.web.rest;

import static javax.ws.rs.core.UriBuilder.fromPath;

import br.com.nosso.codigo.comida.domain.Restaurante;
import br.com.nosso.codigo.comida.web.rest.errors.BadRequestAlertException;
import br.com.nosso.codigo.comida.web.util.HeaderUtil;
import br.com.nosso.codigo.comida.web.util.ResponseUtil;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import javax.enterprise.context.ApplicationScoped;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.*;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * REST controller for managing {@link br.com.nosso.codigo.comida.domain.Restaurante}.
 */
@Path("/api/restaurantes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@ApplicationScoped
public class RestauranteResource {

    private final Logger log = LoggerFactory.getLogger(RestauranteResource.class);

    private static final String ENTITY_NAME = "restaurante";

    @ConfigProperty(name = "application.name")
    String applicationName;

    /**
     * {@code POST  /restaurantes} : Create a new restaurante.
     *
     * @param restaurante the restaurante to create.
     * @return the {@link Response} with status {@code 201 (Created)} and with body the new restaurante, or with status {@code 400 (Bad Request)} if the restaurante has already an ID.
     */
    @POST
    @Transactional
    public Response createRestaurante(Restaurante restaurante, @Context UriInfo uriInfo) {
        log.debug("REST request to save Restaurante : {}", restaurante);
        if (restaurante.id != null) {
            throw new BadRequestAlertException("A new restaurante cannot already have an ID", ENTITY_NAME, "idexists");
        }
        var result = Restaurante.persistOrUpdate(restaurante);
        var response = Response.created(fromPath(uriInfo.getPath()).path(result.id.toString()).build()).entity(result);
        HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.id.toString()).forEach(response::header);
        return response.build();
    }

    /**
     * {@code PUT  /restaurantes} : Updates an existing restaurante.
     *
     * @param restaurante the restaurante to update.
     * @return the {@link Response} with status {@code 200 (OK)} and with body the updated restaurante,
     * or with status {@code 400 (Bad Request)} if the restaurante is not valid,
     * or with status {@code 500 (Internal Server Error)} if the restaurante couldn't be updated.
     */
    @PUT
    @Path("/{id}")
    @Transactional
    public Response updateRestaurante(Restaurante restaurante, @PathParam("id") Long id) {
        log.debug("REST request to update Restaurante : {}", restaurante);
        if (restaurante.id == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        var result = Restaurante.persistOrUpdate(restaurante);
        var response = Response.ok().entity(result);
        HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, restaurante.id.toString()).forEach(response::header);
        return response.build();
    }

    /**
     * {@code DELETE  /restaurantes/:id} : delete the "id" restaurante.
     *
     * @param id the id of the restaurante to delete.
     * @return the {@link Response} with status {@code 204 (NO_CONTENT)}.
     */
    @DELETE
    @Path("/{id}")
    @Transactional
    public Response deleteRestaurante(@PathParam("id") Long id) {
        log.debug("REST request to delete Restaurante : {}", id);
        Restaurante
            .findByIdOptional(id)
            .ifPresent(
                restaurante -> {
                    restaurante.delete();
                }
            );
        var response = Response.noContent();
        HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()).forEach(response::header);
        return response.build();
    }

    /**
     * {@code GET  /restaurantes} : get all the restaurantes.
     *     * @return the {@link Response} with status {@code 200 (OK)} and the list of restaurantes in body.
     */
    @GET
    public List<Restaurante> getAllRestaurantes(@QueryParam("filter") String filter) {
        log.debug("REST request to get all Restaurantes");
        return Restaurante.findAll().list();
    }

    /**
     * {@code GET  /restaurantes/:id} : get the "id" restaurante.
     *
     * @param id the id of the restaurante to retrieve.
     * @return the {@link Response} with status {@code 200 (OK)} and with body the restaurante, or with status {@code 404 (Not Found)}.
     */
    @GET
    @Path("/{id}")
    public Response getRestaurante(@PathParam("id") Long id) {
        log.debug("REST request to get Restaurante : {}", id);
        Optional<Restaurante> restaurante = Restaurante.findByIdOptional(id);
        return ResponseUtil.wrapOrNotFound(restaurante);
    }
}
