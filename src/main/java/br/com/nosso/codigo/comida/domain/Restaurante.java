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
 * A Restaurante.
 */
@Entity
@Table(name = "tb_restaurante")
@Cacheable
@RegisterForReflection
public class Restaurante extends PanacheEntityBase implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(name = "nome")
    public String nome;

    @OneToOne
    @JoinColumn(unique = true)
    public Endereco endereco;

    @OneToOne(mappedBy = "restaurante")
    @JsonIgnore
    public Cardapio cardapio;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Restaurante)) {
            return false;
        }
        return id != null && id.equals(((Restaurante) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Restaurante{" + "id=" + id + ", nome='" + nome + "'" + "}";
    }

    public Restaurante update() {
        return update(this);
    }

    public Restaurante persistOrUpdate() {
        return persistOrUpdate(this);
    }

    public static Restaurante update(Restaurante restaurante) {
        if (restaurante == null) {
            throw new IllegalArgumentException("restaurante can't be null");
        }
        var entity = Restaurante.<Restaurante>findById(restaurante.id);
        if (entity != null) {
            entity.nome = restaurante.nome;
            entity.endereco = restaurante.endereco;
            entity.cardapio = restaurante.cardapio;
        }
        return entity;
    }

    public static Restaurante persistOrUpdate(Restaurante restaurante) {
        if (restaurante == null) {
            throw new IllegalArgumentException("restaurante can't be null");
        }
        if (restaurante.id == null) {
            persist(restaurante);
            return restaurante;
        } else {
            return update(restaurante);
        }
    }
}
