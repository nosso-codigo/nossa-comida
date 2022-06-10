package br.com.nosso.codigo.comida.web.rest;

import static javax.ws.rs.core.UriBuilder.fromPath;

import br.com.nosso.codigo.comida.domain.Endereco;
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
 * REST controller for managing {@link br.com.nosso.codigo.comida.domain.Endereco}.
 */
@Path("/api/enderecos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@ApplicationScoped
public class EnderecoResource {

    private final Logger log = LoggerFactory.getLogger(EnderecoResource.class);

    private static final String ENTITY_NAME = "endereco";

    @ConfigProperty(name = "application.name")
    String applicationName;

    /**
     * {@code POST  /enderecos} : Create a new endereco.
     *
     * @param endereco the endereco to create.
     * @return the {@link Response} with status {@code 201 (Created)} and with body the new endereco, or with status {@code 400 (Bad Request)} if the endereco has already an ID.
     */
    @POST
    @Transactional
    public Response createEndereco(Endereco endereco, @Context UriInfo uriInfo) {
        log.debug("REST request to save Endereco : {}", endereco);
        if (endereco.id != null) {
            throw new BadRequestAlertException("A new endereco cannot already have an ID", ENTITY_NAME, "idexists");
        }
        var result = Endereco.persistOrUpdate(endereco);
        var response = Response.created(fromPath(uriInfo.getPath()).path(result.id.toString()).build()).entity(result);
        HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.id.toString()).forEach(response::header);
        return response.build();
    }

    /**
     * {@code PUT  /enderecos} : Updates an existing endereco.
     *
     * @param endereco the endereco to update.
     * @return the {@link Response} with status {@code 200 (OK)} and with body the updated endereco,
     * or with status {@code 400 (Bad Request)} if the endereco is not valid,
     * or with status {@code 500 (Internal Server Error)} if the endereco couldn't be updated.
     */
    @PUT
    @Path("/{id}")
    @Transactional
    public Response updateEndereco(Endereco endereco, @PathParam("id") Long id) {
        log.debug("REST request to update Endereco : {}", endereco);
        if (endereco.id == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        var result = Endereco.persistOrUpdate(endereco);
        var response = Response.ok().entity(result);
        HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, endereco.id.toString()).forEach(response::header);
        return response.build();
    }

    /**
     * {@code DELETE  /enderecos/:id} : delete the "id" endereco.
     *
     * @param id the id of the endereco to delete.
     * @return the {@link Response} with status {@code 204 (NO_CONTENT)}.
     */
    @DELETE
    @Path("/{id}")
    @Transactional
    public Response deleteEndereco(@PathParam("id") Long id) {
        log.debug("REST request to delete Endereco : {}", id);
        Endereco
            .findByIdOptional(id)
            .ifPresent(
                endereco -> {
                    endereco.delete();
                }
            );
        var response = Response.noContent();
        HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()).forEach(response::header);
        return response.build();
    }

    /**
     * {@code GET  /enderecos} : get all the enderecos.
     *     * @return the {@link Response} with status {@code 200 (OK)} and the list of enderecos in body.
     */
    @GET
    public List<Endereco> getAllEnderecos(@QueryParam("filter") String filter) {
        log.debug("REST request to get all Enderecos");
        return Endereco.findAll().list();
    }

    /**
     * {@code GET  /enderecos/:id} : get the "id" endereco.
     *
     * @param id the id of the endereco to retrieve.
     * @return the {@link Response} with status {@code 200 (OK)} and with body the endereco, or with status {@code 404 (Not Found)}.
     */
    @GET
    @Path("/{id}")
    public Response getEndereco(@PathParam("id") Long id) {
        log.debug("REST request to get Endereco : {}", id);
        Optional<Endereco> endereco = Endereco.findByIdOptional(id);
        return ResponseUtil.wrapOrNotFound(endereco);
    }
}
