package br.com.nosso.codigo.comida.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.runtime.annotations.RegisterForReflection;
import java.io.Serializable;
import javax.json.bind.annotation.JsonbTransient;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Endereco.
 */
@Entity
@Table(name = "tb_endereco")
@Cacheable
@RegisterForReflection
public class Endereco extends PanacheEntityBase implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(name = "rua")
    public String rua;

    @OneToOne(mappedBy = "endereco")
    @JsonIgnore
    public Restaurante restaurante;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Endereco)) {
            return false;
        }
        return id != null && id.equals(((Endereco) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Endereco{" + "id=" + id + ", rua='" + rua + "'" + "}";
    }

    public Endereco update() {
        return update(this);
    }

    public Endereco persistOrUpdate() {
        return persistOrUpdate(this);
    }

    public static Endereco update(Endereco endereco) {
        if (endereco == null) {
            throw new IllegalArgumentException("endereco can't be null");
        }
        var entity = Endereco.<Endereco>findById(endereco.id);
        if (entity != null) {
            entity.rua = endereco.rua;
            entity.restaurante = endereco.restaurante;
        }
        return entity;
    }

    public static Endereco persistOrUpdate(Endereco endereco) {
        if (endereco == null) {
            throw new IllegalArgumentException("endereco can't be null");
        }
        if (endereco.id == null) {
            persist(endereco);
            return endereco;
        } else {
            return update(endereco);
        }
    }
}
